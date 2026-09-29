import { createHmac, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/lib/supabase";

export const runtime = "nodejs";

type StripeSubscription = {
  id: string;
  status?: string;
  customer?: string;
  current_period_end?: number;
  cancel_at_period_end?: boolean;
  metadata?: Record<string, string | undefined>;
};

type StripeEvent = {
  id: string;
  type: string;
  data: { object: StripeSubscription };
};

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  if (!webhookSecret || !verifyStripeSignature(payload, signature, webhookSecret)) {
    return Response.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(payload) as StripeEvent;
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!event.type.startsWith("customer.subscription.")) return Response.json({ received: true });

  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRole) {
    console.error("SUPABASE_SERVICE_ROLE_KEY is not configured for billing webhook writes");
    return Response.json({ error: "Billing backend is not configured." }, { status: 503 });
  }

  const { url } = getSupabasePublicConfig();
  const supabase = createClient(url, serviceRole, { auth: { persistSession: false, autoRefreshToken: false } });
  const subscription = event.data.object;
  const metadata = subscription.metadata || {};
  const kind = metadata.kind;
  const userId = metadata.user_id;
  const organizationId = metadata.organization_id;
  // Checkout writes product_code into both checkout-session and subscription metadata.
  // Keep the legacy `product` fallback so any older live subscriptions remain compatible.
  const product = metadata.product_code || metadata.product;
  const courseId = metadata.course_id;
  const deleted = event.type === "customer.subscription.deleted";
  const periodEnd = subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null;
  const orgStatus = stripeOrgStatus(subscription.status, deleted);
  const productStatus = stripeProductStatus(subscription.status, deleted);

  try {
    if (kind === "plan" && organizationId && userId && ["plus", "pro", "school"].includes(product || "")) {
      const baseSeats = product === "school" ? 300 : product === "pro" ? 60 : 5;
      const { error: entitlementError } = await supabase.from("staff_development_org_entitlements").upsert({
        organization_id: organizationId,
        plan_tier: product,
        status: orgStatus,
        seat_limit: baseSeats,
        stripe_customer_id: subscription.customer || null,
        stripe_subscription_id: subscription.id,
        current_period_end: periodEnd,
        cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
        updated_at: new Date().toISOString(),
      }, { onConflict: "organization_id" });
      if (entitlementError) throw entitlementError;

      const { data: activeAddons } = await supabase
        .from("school_seat_addons")
        .select("quantity,status")
        .eq("organization_id", organizationId)
        .eq("status", "active");
      const addonSeats = (activeAddons || []).reduce((sum, row) => sum + Number(row.quantity || 0) * 5, 0);
      const seatLimit = baseSeats + addonSeats;

      await supabase.from("school_organizations").update({
        seat_limit: seatLimit,
        stripe_subscription_id: subscription.id,
        updated_at: new Date().toISOString(),
      }).eq("id", organizationId);

      await supabase.from("subscriptions").upsert({
        user_id: userId,
        tier: product,
        status: orgStatus === "active" || orgStatus === "trialing" ? "active" : "inactive",
        stripe_customer_id: subscription.customer || null,
        stripe_subscription_id: subscription.id,
        current_period_end: periodEnd,
        cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    }

    if (kind === "seat" && organizationId && userId) {
      const existing = await supabase
        .from("school_seat_addons")
        .select("id")
        .eq("stripe_subscription_id", subscription.id)
        .maybeSingle();
      const row = {
        organization_id: organizationId,
        owner_user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer || null,
        quantity: 1,
        status: orgStatus === "active" || orgStatus === "trialing" ? "active" : "inactive",
        current_period_end: periodEnd,
        cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
        updated_at: new Date().toISOString(),
      };
      if (existing.data?.id) await supabase.from("school_seat_addons").update(row).eq("id", existing.data.id);
      else await supabase.from("school_seat_addons").insert(row);

      const { data: entitlement } = await supabase
        .from("staff_development_org_entitlements")
        .select("plan_tier")
        .eq("organization_id", organizationId)
        .maybeSingle();
      const baseSeats = entitlement?.plan_tier === "school" ? 300 : entitlement?.plan_tier === "pro" ? 60 : 5;
      const { data: activeAddons } = await supabase
        .from("school_seat_addons")
        .select("quantity")
        .eq("organization_id", organizationId)
        .eq("status", "active");
      const addonSeats = (activeAddons || []).reduce((sum, addon) => sum + Number(addon.quantity || 0) * 5, 0);
      await supabase.from("staff_development_org_entitlements").update({ seat_limit: baseSeats + addonSeats, updated_at: new Date().toISOString() }).eq("organization_id", organizationId);
      await supabase.from("school_organizations").update({ seat_limit: baseSeats + addonSeats, updated_at: new Date().toISOString() }).eq("id", organizationId);
    }

    if ((kind === "single_cpd" || kind === "all_cpd") && userId) {
      const productCode = kind;
      let query = supabase
        .from("staff_development_product_entitlements")
        .select("id")
        .eq("user_id", userId)
        .eq("product_code", productCode);
      query = productCode === "single_cpd" ? query.eq("course_id", courseId || "") : query.is("course_id", null);
      const existing = await query.maybeSingle();
      const row = {
        user_id: userId,
        product_code: productCode,
        course_id: productCode === "single_cpd" ? courseId || null : null,
        status: productStatus,
        stripe_customer_id: subscription.customer || null,
        stripe_subscription_id: subscription.id,
        expires_at: periodEnd,
        updated_at: new Date().toISOString(),
      };
      if (existing.data?.id) await supabase.from("staff_development_product_entitlements").update(row).eq("id", existing.data.id);
      else await supabase.from("staff_development_product_entitlements").insert(row);
    }
  } catch (error) {
    console.error("Stripe entitlement sync failed", event.id, error);
    return Response.json({ error: "Entitlement sync failed." }, { status: 500 });
  }

  return Response.json({ received: true });
}

function stripeOrgStatus(status: string | undefined, deleted: boolean) {
  if (deleted || status === "canceled") return "canceled";
  if (status === "active") return "active";
  if (status === "trialing") return "trialing";
  if (status === "past_due" || status === "unpaid") return "past_due";
  return "inactive";
}

function stripeProductStatus(status: string | undefined, deleted: boolean) {
  if (deleted || status === "canceled") return "canceled";
  if (status === "active") return "active";
  if (status === "trialing") return "trialing";
  return "expired";
}

function verifyStripeSignature(payload: string, header: string, secret: string) {
  const fields = header.split(",").map((part) => part.trim());
  const timestamp = fields.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = fields.filter((part) => part.startsWith("v1=")).map((part) => part.slice(3));
  if (!timestamp || signatures.length === 0) return false;
  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber) || Math.abs(Date.now() / 1000 - timestampNumber) > 300) return false;

  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload}`, "utf8").digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  return signatures.some((signature) => {
    const signatureBuffer = Buffer.from(signature, "utf8");
    return signatureBuffer.length === expectedBuffer.length && timingSafeEqual(signatureBuffer, expectedBuffer);
  });
}
