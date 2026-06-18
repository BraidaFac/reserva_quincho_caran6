import { BookingsDashboard } from "@/components/admin/bookings-dashboard";

export default function AdminPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard de Reservas</h1>
        <p className="text-sm text-muted-foreground mt-1">Todas las reservas del edificio</p>
      </div>
      <BookingsDashboard />
    </div>
  );
}
