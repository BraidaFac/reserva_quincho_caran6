import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUpcomingBookings } from "@/lib/bookings";
import { Navbar } from "@/components/navbar";
import { BookingsSection } from "@/components/bookings-section";

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = session.user as any;
  const isAdmin = user.role === "ADMIN";

  const allBookings = await getUpcomingBookings();

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar />
      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 sm:py-2 py-4 flex flex-col flex-1 min-h-0">
        <div className="mb-4 sm:mb-2">
          <h1 className="text-2xl font-bold text-foreground">
            Reservas de turnos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Seleccioná un día para reservar tu turno
          </p>
        </div>
        <BookingsSection
          userId={session.user.id}
          isAdmin={isAdmin}
          initialBookings={allBookings}
        />
      </main>
    </div>
  );
}
