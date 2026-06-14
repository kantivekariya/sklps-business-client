import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Admin dashboard login for SKLPS Business Directory.",
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
