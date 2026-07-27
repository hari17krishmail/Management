"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  Eye, EyeOff, Loader2, Lock, LogIn, Mail } from "lucide-react";
import { toast } from "sonner";
import { loginSchema, type LoginFormValues } from "@/lib/validation/login-schema";
import { createSessionCookie, setAccessToken, setUserEmail } from "@/lib/auth";
import { getApiErrorMessage } from "@/lib/api-error";
import { useLoginMutation } from "@/services/auth/authApi";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setAuthError(null);

    try {
      const response = await login(values).unwrap();
      setAccessToken(response.responseObj.responseDataParams.data.token);
      setUserEmail(values.email);
      createSessionCookie();
      toast.success(response.responseObj.responseMessage);
      router.push("/user-management");
      router.refresh();
    } catch (error) {
      setAuthError(getApiErrorMessage(error, "Invalid email or password. Please try again."));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[300px] overflow-hidden sm:h-[360px]">
        <img
          src="/login-header-bg.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div className="relative flex h-full items-start justify-center pt-12 sm:pt-14">
          <h1 className="px-4 text-center font-serif text-2xl sm:text-3xl font-bold tracking-wide text-white sm:text-4xl">
            WELCOME BACK!
          </h1>
        </div>
      </div>

      <div className="relative -mt-46 px-4 pb-16 sm:-mt-54">
        <div className="mx-auto w-full max-w-md">
          <div className="relative rounded-3xl bg-white px-6 pb-8 pt-8 shadow-xl sm:px-7">

            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">Educon Admin Portal</h2>
              <p className="mt-1 text-sm text-gray-500">Secure access for administrators</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@company.com"
                    aria-invalid={errors.email ? "true" : "false"}
                    className={`block w-full rounded-lg border bg-gray-50 py-2.5 pl-9 pr-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                      errors.email ? "border-red-400" : "border-gray-200 focus:border-blue-500"
                    }`}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    aria-invalid={errors.password ? "true" : "false"}
                    className={`block w-full rounded-lg border bg-gray-50 py-2.5 pl-9 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                      errors.password ? "border-red-400" : "border-gray-200 focus:border-blue-500"
                    }`}
                    {...register("password")}
                  />
                  <Button
                    variant="unstyled"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {authError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                  {authError}
                </div>
              )}

              <Button
                type="submit"
                variant="unstyled"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:from-blue-800 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
                {isLoading ? "Signing in..." : "Login"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
