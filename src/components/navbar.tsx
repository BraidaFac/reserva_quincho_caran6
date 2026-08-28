"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user as any;

  async function handleLogout() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <path d="M12 2C8 7 4 10 4 14.5C4 18.64 7.58 22 12 22C16.42 22 20 18.64 20 14.5C20 10 16 7 12 2Z" fill="hsl(15 75% 48%)" opacity="0.9"/>
            <path d="M12 6C10 9 8 11 8 13.5C8 16.54 9.79 18 12 18C14.21 18 16 16.54 16 13.5C16 11 14 9 12 6Z" fill="hsl(30 90% 70%)" opacity="0.8"/>
          </svg>
          <span className="font-display font-semibold text-foreground">Caran <span className="text-primary">VI</span></span>
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{user.username}</span>
              <Badge variant="secondary">P{user.floor} · D{user.flat}</Badge>
              {user.role === "ADMIN" && <Badge variant="default">Admin</Badge>}
            </div>
            <div className="flex sm:hidden items-center">
              <Badge variant="secondary">{user.floor}/{user.flat}</Badge>
            </div>
            {user.role === "ADMIN" && (
              <Button variant="ghost" size="icon" asChild title="Panel admin">
                <Link href="/admin">
                  <LayoutDashboard className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Cerrar sesión">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
