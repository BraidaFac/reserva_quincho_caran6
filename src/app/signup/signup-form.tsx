"use client";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";
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
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

const INITIAL_FORM = {
  username: "",
  email: "",
  password: "",
  flat: "",
  floor: "",
};

export function SignupForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);

  const update =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setIsLoading(true);
    try {
      const email = form.email.trim() || `${form.username}@noemail.local`;
      const { error } = await signUp.email({
        email,
        password: form.password,
        name: form.username,
        username: form.username,
        flat: form.flat,
        floor: form.floor,
      });
      if (error) {
        toast.error(error.message ?? "Error al crear la cuenta");
        return;
      }
      toast.success("Cuenta creada correctamente");
      setForm(INITIAL_FORM);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.message ?? "Error al crear la cuenta");
    } finally {
      setIsLoading(false);
    }
  }

  const fields = [
    {
      id: "username",
      label: "Usuario",
      placeholder: "nombreusuario",
      type: "text",
    },
    {
      id: "email",
      label: "Email (opcional)",
      placeholder: "usuario@email.com",
      type: "email",
      optional: true,
    },
    {
      id: "password",
      label: "Contraseña",
      placeholder: "Mínimo 6 caracteres",
      type: "password",
    },
    { id: "floor", label: "Piso", placeholder: "Ej: 3", type: "text" },
    { id: "flat", label: "Departamento", placeholder: "Ej: A", type: "text" },
  ] satisfies {
    id: keyof typeof INITIAL_FORM;
    label: string;
    placeholder: string;
    type: string;
    optional?: boolean;
  }[];

  return (
    <Card className="w-full max-w-sm shadow-md">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-accent flex items-center justify-center">
          <UserPlus className="h-5 w-5 text-accent-foreground" />
        </div>
        <CardTitle className="text-2xl">Crear usuario</CardTitle>
        <CardDescription>Solo disponible para administradores</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          {fields.map(({ id, label, placeholder, type, optional }) => (
            <div key={id} className="space-y-1.5">
              <Label htmlFor={id}>{label}</Label>
              <Input
                id={id}
                type={type}
                placeholder={placeholder}
                value={form[id]}
                onChange={update(id)}
                autoComplete="off"
                required={!optional}
              />
            </div>
          ))}
          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Crear cuenta
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
