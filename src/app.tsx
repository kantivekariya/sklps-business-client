import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/modules/auth/auth-context";
import { BusinessAuthProvider } from "@/modules/auth/business-auth-context";
import { router } from "@/routes";

export default function App() {
  return (
    <AuthProvider>
      <BusinessAuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </BusinessAuthProvider>
    </AuthProvider>
  );
}
