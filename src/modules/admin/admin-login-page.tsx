import { Eye, EyeOff, Loader2, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/modules/auth/auth-context";

export default function AdminLoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>();
  const { login, admin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && admin) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [admin, authLoading, navigate]);

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);
    setError("");
    try {
      await login(data.email, data.password);
      // navigation is handled by useEffect once admin state has committed
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-neutral-950 text-white p-12">
        <div className="flex items-center gap-3">
          <img src="/images/home/SKLPS%20LOGO-04.svg" alt="SKLPS" className="h-10 w-auto" />
          <span className="text-xl font-bold tracking-tight">SKLPS Admin</span>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold leading-tight mb-4">
            Manage your community
            <br />
            business directory.
          </h1>
          <p className="text-neutral-400 text-lg leading-relaxed max-w-sm">
            Approve businesses, manage job listings, and keep your community directory up to date.
          </p>
        </div>
        <p className="text-neutral-600 text-sm">
          © {new Date().getFullYear()} SKLPS Business Directory
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <img src="/images/home/SKLPS%20LOGO-04.svg" alt="SKLPS" className="h-9 w-auto" />
            <span className="text-lg font-bold">SKLPS Admin</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-1">Welcome back</h2>
          <p className="text-muted-foreground text-sm mb-8">Sign in to your admin account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@sklps.com"
                autoComplete="email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pr-10"
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button className="w-full" type="submit" disabled={loading} size="lg">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
