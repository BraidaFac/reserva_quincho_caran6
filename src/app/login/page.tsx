"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await signIn.username({ username: form.username, password: form.password });
      if (error) {
        toast.error("Usuario o contraseña incorrectos");
        return;
      }
      toast.success("Bienvenido");
      router.push("/");
    } catch {
      toast.error("Usuario o contraseña incorrectos");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 sm:px-4 relative overflow-hidden bg-background">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary opacity-5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-accent opacity-30 blur-3xl" />
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center mb-8 animate-fade-slide-up">
          <div className="mb-4 h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-9 w-9">
              <rect x="4" y="8" width="24" height="20" rx="1" fill="white" opacity="0.2"/>
              <rect x="6" y="6" width="20" height="22" rx="1" fill="white" opacity="0.9"/>
              <rect x="9" y="10" width="5" height="4" rx="0.5" fill="hsl(152,45%,55%)" opacity="0.7"/>
              <rect x="18" y="10" width="5" height="4" rx="0.5" fill="hsl(152,45%,55%)" opacity="0.7"/>
              <rect x="9" y="17" width="5" height="4" rx="0.5" fill="hsl(152,45%,55%)" opacity="0.7"/>
              <rect x="18" y="17" width="5" height="4" rx="0.5" fill="hsl(152,45%,55%)" opacity="0.7"/>
              <rect x="13" y="24" width="6" height="4" rx="0.5" fill="hsl(152,45%,55%)" opacity="0.5"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Caran <span className="text-primary">VI</span></h1>
          <p className="text-sm text-muted-foreground mt-1">Sistema de reservas</p>
        </div>

        <Card className="shadow-xl border-border/50 backdrop-blur-sm animate-fade-slide-up animation-delay-150">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Iniciar sesión</CardTitle>
            <CardDescription>Ingresá tus credenciales para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
              <div className="space-y-1.5">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Ej: 0704"
                  value={form.username}
                  onChange={update("username")}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={update("password")}
                  autoComplete="current-password"
                  required
                />
              </div>
              <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Ingresar
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6 animate-fade-in animation-delay-250">
          Edificio Caran VI &mdash; Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
