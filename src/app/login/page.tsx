"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const update =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await signIn.username({
        username: form.username,
        password: form.password,
      });
      if (error) {
        console.log(error);
        toast.error("Usuario o contraseña incorrectos");
        return;
      }
      toast.success("Bienvenido");
      router.push("/");
    } catch (e) {
      console.log(e);
      toast.error("Usuario o contraseña incorrectos");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 sm:px-4 relative overflow-hidden bg-background">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(15_75%_48%)] opacity-[0.06] blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[hsl(30_60%_55%)] opacity-[0.08] blur-3xl" />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] rounded-full bg-[hsl(40_50%_60%)] opacity-[0.05] blur-3xl" />
        {/* Grid pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="hsl(20 15% 15%)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center mb-8 animate-fade-scale-in">
          <div className="mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-[hsl(25_80%_45%)] flex items-center justify-center shadow-lg shadow-primary/25">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-9 w-9"
            >
              {/* Abstract ember/flame icon */}
              <path
                d="M16 4C16 4 12 10 12 16C12 19 13.5 21.5 16 23C18.5 21.5 20 19 20 16C20 10 16 4 16 4Z"
                fill="white"
                opacity="0.9"
              />
              <path
                d="M16 10C16 10 13.5 14 13.5 18C13.5 20 14.5 21.5 16 22.5C17.5 21.5 18.5 20 18.5 18C18.5 14 16 10 16 10Z"
                fill="hsl(30 80% 55%)"
                opacity="0.7"
              />
              <path
                d="M16 15C16 15 15 17 15 19C15 20.2 15.4 21 16 21.5C16.6 21 17 20.2 17 19C17 17 16 15 16 15Z"
                fill="hsl(15 75% 48%)"
                opacity="0.8"
              />
              <ellipse
                cx="16"
                cy="26"
                rx="5"
                ry="1.5"
                fill="white"
                opacity="0.15"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
            Caran <span className="text-primary">VI</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sistema de reservas
          </p>
        </div>

        <Card className="shadow-warm-md border-border/50 border-t-2 border-t-primary/30 backdrop-blur-sm animate-fade-scale-in animation-delay-150">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Iniciar sesión</CardTitle>
            <CardDescription>
              Ingresá tus credenciales para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              suppressHydrationWarning
            >
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
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Ingresar
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground/70 mt-6 animate-fade-in animation-delay-250">
          Edificio Caran VI &mdash; Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
