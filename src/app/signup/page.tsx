import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignupForm } from "./signup-form";

export default async function SignupPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user as any;
  //if (user?.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <SignupForm />
    </div>
  );
}
