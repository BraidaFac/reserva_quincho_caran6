import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "mysql" }),
  emailAndPassword: { enabled: true },
  plugins: [
    username({
      minUsernameLength: 1,
      usernameValidator: () => true,
      usernameNormalization: false,
    }),
  ],
  user: {
    additionalFields: {
      flat: { type: "string", required: true },
      floor: { type: "string", required: true },
      role: { type: "string", defaultValue: "USER" },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
});
