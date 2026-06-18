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
    <header className="border-b bg-card">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🏠</span>
          <span className="font-semibold text-foreground">Reservas</span>
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
