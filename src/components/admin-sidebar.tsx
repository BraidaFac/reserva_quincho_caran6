"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, LogOut, Home } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Reservas", icon: LayoutDashboard },
  { href: "/admin/users", label: "Usuarios", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

  return (
    <aside className="w-14 sm:w-52 border-r bg-card flex flex-col flex-shrink-0">
      <div className="p-4 border-b flex items-center gap-2">
        <span className="text-lg">🏠</span>
        <span className="hidden sm:block font-semibold text-sm">Panel Admin</span>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:block">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4 flex-shrink-0" />
          <span className="hidden sm:block">Ir al inicio</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span className="hidden sm:block">Salir</span>
        </button>
      </div>
    </aside>
  );
}
