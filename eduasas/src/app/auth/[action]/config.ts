// app/auth/[action]/config.ts

import type { Metadata } from "next";

export const authConfig = {
  login: {
    metadata: {
      title: "Login",
      description: "Access your account",
    },
  },

  register: {
    metadata: {
      title: "Create Account",
      description: "Join the platform",
    },
  },

  forgot: {
    metadata: {
      title: "Forgot Password",
      description: "Reset your password",
    },
  },

  reset: {
    metadata: {
      title: "Reset Password",
      description: "Create a new password",
    },
  },
} as const satisfies Record<
  string,
  {
    metadata: Metadata;
  }
>;

export type AuthAction = keyof typeof authConfig;