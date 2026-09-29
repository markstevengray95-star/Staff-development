import { redirect } from "next/navigation";
export default function AdminLoginRedirect(){ redirect("/auth?next=/admin"); }
