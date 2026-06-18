import { UsersPanel } from "@/components/admin/users-panel";

export default function AdminUsersPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
        <p className="text-sm text-muted-foreground mt-1">Crear, editar y eliminar usuarios del sistema</p>
      </div>
      <UsersPanel />
    </div>
  );
}
