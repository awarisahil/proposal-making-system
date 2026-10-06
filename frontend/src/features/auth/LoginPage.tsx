import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  FileText,
  Loader2,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  loginSchema,
  type LoginFormValues,
} from "./auth.schema";

import { login } from "./auth.service";

import {
  setAccessToken,
  setRefreshToken,
  setStoredUser,
  setStoredOrganization,
  setStoredRoles,
} from "../../utils/auth-storage";

export default function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [serverError, setServerError] =
    useState("");

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (
    values: LoginFormValues
  ) => {
    setServerError("");

    try {
      const response = await login(values);

      if (
        !response.success ||
        !response.data?.accessToken
      ) {
        setServerError(
          response.message ||
            "Unable to login"
        );

        return;
      }

setAccessToken(
  response.data.accessToken
);

setRefreshToken(
  response.data.refreshToken
);
setStoredUser(
  response.data.user
);

setStoredOrganization(
  response.data.organization
);

setStoredRoles(
  response.data.roles
);
      navigate("/dashboard", {
        replace: true,
      });
    } catch (error: any) {
      setServerError(
        error.response?.data?.message ||
          "Unable to connect to the server"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left branding section */}

        <div className="hidden bg-slate-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                <FileText
                  className="text-slate-900"
                  size={24}
                />
              </div>

              <span className="text-xl font-bold text-white">
                ProposalFlow
              </span>
            </div>

            <div className="mt-24 max-w-lg">
              <h1 className="text-5xl font-bold leading-tight text-white">
                Create proposals
                <br />
                that win business.
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                Manage clients, products,
                proposals, approvals and
                documents from one powerful
                workspace.
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-400">
            Proposal Management System
          </p>
        </div>

        {/* Login section */}

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900">
                  <FileText
                    className="text-white"
                    size={21}
                  />
                </div>

                <span className="text-xl font-bold text-slate-900">
                  ProposalFlow
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-sm sm:p-9">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Sign in to your account to
                  continue.
                </p>
              </div>

              {serverError && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {serverError}
                </div>
              )}

              <form
                onSubmit={handleSubmit(
                  onSubmit
                )}
                className="mt-7 space-y-5"
              >
                {/* Email */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    {...register("email")}
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition ${
                      errors.email
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                    }`}
                  />

                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      {...register("password")}
                      className={`w-full rounded-lg border px-3.5 py-2.5 pr-11 text-sm outline-none transition ${
                        errors.password
                          ? "border-red-400 focus:ring-2 focus:ring-red-100"
                          : "border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) => !value
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {
                        errors.password
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting && (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {isSubmitting
                    ? "Signing in..."
                    : "Sign in"}
                </button>
              </form>

              <div className="mt-7 text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-slate-900 hover:underline"
                >
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}