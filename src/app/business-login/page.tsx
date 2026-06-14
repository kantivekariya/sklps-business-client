"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBusinessAuth } from "@/context/business-auth-context";

export default function BusinessLoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login, business, loading: authLoading } = useBusinessAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && business) {
      router.replace("/business-dashboard");
    }
  }, [business, authLoading, router]);

  const onSubmit = async (data: Record<string, string>) => {
    setLoading(true);
    setError("");
    try {
      await login(data.email, data.password);
      router.push("/business-dashboard");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || business) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Business Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your business dashboard. Use the email and
              temporary password sent to you after approval.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-xs">
                      {(errors.email as { message?: string }).message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Temporary password from email"
                    {...register("password", { required: "Password is required" })}
                  />
                  {errors.password && (
                    <span className="text-red-500 text-xs">
                      {(errors.password as { message?: string }).message}
                    </span>
                  )}
                </div>
              </div>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              <div className="mt-4">
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login
                </Button>
              </div>
            </form>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/add" className="text-primary hover:underline">
                Register your business
              </Link>
            </p>
          </CardContent>
        </Card>
    </div>
  );
}
