import { createClient } from "@supabase/supabase-js";
import { courses } from "@/lib/catalogue";
import { getSupabasePublicConfig } from "@/lib/supabase";

export const runtime = "nodejs";

type CheckoutBody = {
  kind?: "plan" | "single_cpd" | "all_cpd" | "seat";
  product?: string;
  courseId?: string;
  organizationId?: string | null;
};

const priceEnv: Record<string, string> = {
  plus: "STRIPE_PRICE_PLUS",
  pro: "STRIPE_PRICE_PRO",
  school: "STRIPE_PRICE_SCHOOL",
  seat_5: "STRIPE_PRICE_SEAT_5",
  single_cpd: "STRIPE_PRICE_SINGLE_CPD",
  all_cpd: "STRIPE_PRICE_ALL_CPD",
};

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization") || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    if (!token) return Response.json({ error: "Sign in before starting checkout." }, { status: 401 });

    const { url, key } = getSupabasePublicConfig();
    const supabase = createClient(url, key, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: auth, error: authError } = await supabase.auth.getUser(token);
    if (authError || !auth.user) return Response.json({ error: "Your session has expired. Sign in again." }, { status: 401 });

    const body = (await request.json()) as CheckoutBody;
    const kind = body.kind;
    const product = String(body.product || "").toLowerCase();
    const organizationId = body.organizationId || null;

    if (!kind || !["plan", "single_cpd", "all_cpd", "seat"].includes(kind)) {
      return Response.json({ error: "Unknown billing option." }, { status: 400 });
    }

    let priceKey = product;
    if (kind === "single_cpd") priceKey = "single_cpd";
    if (kind === "all_cpd") priceKey = "all_cpd";
    if (kind === "seat") priceKey = "seat_5";

    if (kind === "plan" && !["plus", "pro", "school"].includes(product)) {
      return Response.json({ error: "Unknown plan." }, { status: 400 });
    }

    if (kind === "single_cpd") {
      if (!body.courseId || !courses.some((course) => course.id === body.courseId)) {
        return Response.json({ error: "Choose a valid CPD course." }, { status: 400 });
      }
    }

    if (kind === "plan" || kind === "seat") {
      if (!organizationId) return Response.json({ error: "Create or select a school workspace first." }, { status: 400 });
      const { data: org } = await supabase
        .from("school_organizations")
        .select("id,owner_user_id")
        .eq("id", organizationId)
        .maybeSingle();
      if (!org || org.owner_user_id !== auth.user.id) {
        return Response.json({ error: "Only the school workspace owner can change billing." }, { status: 403 });
      }
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env[priceEnv[priceKey] || ""];
    if (!stripeSecret || !priceId) {
      return Response.json({ error: "Stripe is connected in the app, but this deployment still needs its Stripe secret and price IDs configured." }, { status: 503 });
    }

    const origin = new URL(request.url).origin;
    const params = new URLSearchParams();
    params.set("mode", "subscription");
    params.set("line_items[0][price]", priceId);
    params.set("line_items[0][quantity]", "1");
    params.set("success_url", `${origin}/?billing=success`);
    params.set("cancel_url", `${origin}/?billing=cancelled`);
    params.set("client_reference_id", auth.user.id);
    if (auth.user.email) params.set("customer_email", auth.user.email);
    params.set("allow_promotion_codes", "true");

    const metadata: Record<string, string> = {
      user_id: auth.user.id,
      kind,
      product: priceKey,
    };
    if (organizationId) metadata.organization_id = organizationId;
    if (body.courseId) metadata.course_id = body.courseId;

    for (const [keyName, value] of Object.entries(metadata)) {
      params.set(`metadata[${keyName}]`, value);
      params.set(`subscription_data[metadata][${keyName}]`, value);
    }

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });
    const stripePayload = await stripeResponse.json();
    if (!stripeResponse.ok || !stripePayload.url) {
      return Response.json({ error: stripePayload?.error?.message || "Stripe could not start checkout." }, { status: 502 });
    }

    return Response.json({ url: stripePayload.url });
  } catch (error) {
    console.error("checkout error", error);
    return Response.json({ error: "Unable to start checkout." }, { status: 500 });
  }
}
