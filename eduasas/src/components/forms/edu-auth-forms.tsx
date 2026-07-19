// components/auth/AuthForm.tsx

"use client";

import type { AuthAction } from "@/app/auth/[action]/config";

type Props = {
  action: AuthAction;
};

export function AuthForm({
  action,
}: Props) {

  const ActionForm = () => {

    switch (action) {
      case "login":
        return (
          <form className="space-y-4">
            <h1 className="text-2xl font-semibold">
              Login
            </h1>

            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-lg border p-3"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-lg border p-3"
            />

            <button className="w-full rounded-lg bg-black p-3 text-white">
              Login
            </button>
          </form>
        );

      case "register":
        return (
          <form className="space-y-4">
            <h1 className="text-2xl font-semibold">
              Create Account
            </h1>

            <input
              type="text"
              placeholder="Full name"
              className="w-full rounded-lg border p-3"
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-lg border p-3"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-lg border p-3"
            />

            <button className="w-full rounded-lg bg-black p-3 text-white">
              Register
            </button>
          </form>
        );

      case "forgot":
        return (
          <form className="space-y-4">
            <h1 className="text-2xl font-semibold">
              Forgot Password
            </h1>

            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-lg border p-3"
            />

            <button className="w-full rounded-lg bg-black p-3 text-white">
              Send Reset Link
            </button>
          </form>
        );

      case "reset":
        return (
          <form className="space-y-4">
            <h1 className="text-2xl font-semibold">
              Reset Password
            </h1>

            <input
              type="password"
              placeholder="New password"
              className="w-full rounded-lg border p-3"
            />

            <input
              type="password"
              placeholder="Confirm password"
              className="w-full rounded-lg border p-3"
            />

            <button className="w-full rounded-lg bg-black p-3 text-white">
              Reset Password
            </button>
          </form>
        );

      default:
        return null;
    }
  }

  return (
    <>
      {ActionForm && (
        <div>
          <ActionForm />
        </div>
      )}

    </>

  )
}