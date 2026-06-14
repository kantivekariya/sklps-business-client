import { redirect } from "next/navigation";

// Business registration - redirects to add business form
export default function BusinessRegisterPage() {
  redirect("/add");
}
