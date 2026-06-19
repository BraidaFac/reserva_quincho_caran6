"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface User {
  id: string;
  username: string;
  email: string;
  flat: string;
  floor: string;
  role: "ADMIN" | "USER";
  createdAt: string;
}

type ModalState =
  | { type: "create" }
  | { type: "edit"; user: User }
  | { type: "password"; user: User }
  | { type: "delete"; user: User }
  | null;

const EMPTY_FORM = { username: "", email: "", password: "", flat: "", floor: "", role: "USER" as "ADMIN" | "USER" };

export function UsersPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [isSaving, setIsSaving] = useState(false);

  async function loadUsers() {
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
    setIsLoading(false);
  }

  useEffect(() => { loadUsers(); }, []);

  function openCreate() {
    setForm({ ...EMPTY_FORM });
    setModal({ type: "create" });
  }

  function openEdit(user: User) {
    setForm({ username: user.username, email: user.email, password: "", flat: user.flat, floor: user.floor, role: user.role });
    setModal({ type: "edit", user });
  }

  function openPassword(user: User) {
    setForm({ ...EMPTY_FORM, password: "" });
    setModal({ type: "password", user });
  }

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setIsSaving(false);
    if (res.ok) {
      toast.success("Usuario creado");
      setModal(null);
      loadUsers();
    } else {
      const data = await res.json();
      toast.error(data.error ?? "Error al crear usuario");
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (modal?.type !== "edit") return;
    setIsSaving(true);
    const res = await fetch(`/api/admin/users/${modal.user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: form.username, flat: form.flat, floor: form.floor, role: form.role }),
    });
    setIsSaving(false);
    if (res.ok) {
      toast.success("Usuario actualizado");
      setModal(null);
      loadUsers();
    } else {
      toast.error("Error al actualizar");
    }
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    if (modal?.type !== "password") return;
    setIsSaving(true);
    const res = await fetch(`/api/admin/users/${modal.user.id}/password`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: form.password }),
    });
    setIsSaving(false);
    if (res.ok) {
      toast.success("Contraseña actualizada");
      setModal(null);
    } else {
      toast.error("Error al cambiar contraseña");
    }
  }

  async function handleDelete() {
    if (modal?.type !== "delete") return;
    setIsSaving(true);
    const res = await fetch(`/api/admin/users/${modal.user.id}`, { method: "DELETE" });
    setIsSaving(false);
    if (res.ok) {
      toast.success("Usuario eliminado");
      setModal(null);
      setUsers((prev) => prev.filter((u) => u.id !== modal.user.id));
    } else {
      const data = await res.json();
      toast.error(data.error ?? "Error al eliminar");
    }
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Nuevo usuario
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Usuario</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Depto</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}><div className="h-4 bg-muted animate-pulse rounded" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  No hay usuarios
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    P{user.floor} · D{user.flat}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                      {user.role === "ADMIN" ? "Admin" : "Usuario"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openPassword(user)} title="Cambiar contraseña">
                        <KeyRound className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(user)} title="Editar">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => setModal({ type: "delete", user })} title="Eliminar">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create modal */}
      <Dialog open={modal?.type === "create"} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Nuevo usuario</DialogTitle>
            <DialogDescription>Completá los datos para crear la cuenta</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-3">
            {[
              { id: "username", label: "Usuario", type: "text", placeholder: "nombreusuario" },
              { id: "email", label: "Email", type: "email", placeholder: "usuario@email.com" },
              { id: "password", label: "Contraseña", type: "password", placeholder: "Contraseña" },
              { id: "floor", label: "Piso", type: "text", placeholder: "Ej: 3" },
              { id: "flat", label: "Departamento", type: "text", placeholder: "Ej: A" },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={`c-${id}`}>{label}</Label>
                <Input id={`c-${id}`} type={type} placeholder={placeholder} value={form[id as keyof typeof form]} onChange={update(id as keyof typeof form)} required />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label>Rol</Label>
              <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as any }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Usuario</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />} Crear usuario
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit modal */}
      <Dialog open={modal?.type === "edit"} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>Modificá los datos del usuario</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-3">
            {[
              { id: "username", label: "Usuario", type: "text", placeholder: "nombreusuario" },
              { id: "floor", label: "Piso", type: "text", placeholder: "Ej: 3" },
              { id: "flat", label: "Departamento", type: "text", placeholder: "Ej: A" },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={`e-${id}`}>{label}</Label>
                <Input id={`e-${id}`} type={type} placeholder={placeholder} value={form[id as keyof typeof form]} onChange={update(id as keyof typeof form)} required />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label>Rol</Label>
              <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as any }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Usuario</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />} Guardar cambios
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Password modal */}
      <Dialog open={modal?.type === "password"} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>Cambiar contraseña</DialogTitle>
            <DialogDescription>
              {modal?.type === "password" ? `Usuario: ${modal.user.username}` : ""}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePassword} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="new-password">Nueva contraseña</Label>
              <Input id="new-password" type="password" placeholder="Nueva contraseña" value={form.password} onChange={update("password")} required />
            </div>
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />} Actualizar contraseña
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm modal */}
      <Dialog open={modal?.type === "delete"} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>Eliminar usuario</DialogTitle>
            <DialogDescription>
              ¿Seguro que querés eliminar a{" "}
              <strong>{modal?.type === "delete" ? modal.user.username : ""}</strong>?
              Esta acción borrará también todas sus reservas.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setModal(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />} Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
