// app/auth/[action]/config.ts

import type { Metadata } from "next";

export const authConfig = {
  login: {
    metadata: {
      title: "Login",
      description: "Access your existing account by signing in",
    },
  },

  register: {
    metadata: {
      title: "Create Account",
      description: "You don't have an account?. Join the platform by signing up for new account",
    },
  },

  verify: {
    metadata: {
      title: "Verify OTP",
      description: "Verify account to join the platform"
    }
  },

  forgot: {
    metadata: {
      title: "Forgot Password",
      description: "Reset your password and get your existing account back",
    },
  },

  reset: {
    metadata: {
      title: "Reset Password",
      description: "Create a new strong password for your existing account",
    },
  },
} as const satisfies Record<
  string,
  {
    metadata: Metadata;
  }
>;

export type AuthAction = keyof typeof authConfig;