import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBusinessAuth } from "@/modules/auth/business-auth-context";

export default function BusinessLoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>();
  const { login, business, loading: authLoading } = useBusinessAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && business) {
      navigate("/business-dashboard", { replace: true });
    }
  }, [business, authLoading, navigate]);

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);
    setError("");
    try {
      await login(data.email, data.password);
      // navigation is handled by useEffect once business state has committed
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || business) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left branding panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between text-white p-12"
        style={{ background: "linear-gradient(150deg, #FF385C 0%, #FC642D 100%)" }}
      >
        <div className="flex flex-col items-start gap-3">
          <Logo variant="dark" iconSize={64} showTagline={false} linkTo={false} />
          <div>
            <p className="text-xl font-extrabold tracking-tight leading-tight">Business Portal</p>
            <p className="text-[11px] text-white/65 tracking-[0.18em] uppercase mt-0.5">SKLPS Community</p>
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold leading-tight mb-4">
            Manage your business
            <br />
            in one place.
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-sm">
            Post jobs, update your profile, and connect with the SKLPS community — all from your
            business dashboard.
          </p>
        </div>
        <p className="text-white/50 text-sm">
          © {new Date().getFullYear()} SKLPS Business Directory
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <Logo iconSize={36} showTagline={false} linkTo={false} />
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-1">Business Login</h2>
          <p className="text-muted-foreground text-sm mb-8">
            Access your approved business account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@business.com"
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

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Not registered yet?{" "}
            <Link
              to="/add-business"
              className="text-primary font-semibold hover:underline underline-offset-2"
            >
              Add your business
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
