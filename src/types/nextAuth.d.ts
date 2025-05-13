// types/next-auth.d.ts or wherever you keep your types

import "next-auth";
import "next-auth/jwt";

// <reference types="node" />
export {};

declare namespace NodeJS {
  interface ProcessEnv {
    RESEND_API_KEY: string;
    MONGODB_URL: string;
    NEXTAUTH_SECRET: string;
  }
}

declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }

  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    } & import("next-auth").DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}
