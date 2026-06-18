import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUpcomingBookings, getBookingsByUserId } from "@/lib/bookings";
import { Navbar } from "@/components/navbar";
import { BookingCalendar } from "@/components/booking-calendar";
import { BookingList } from "@/components/booking-list";
import { Separator } from "@/components/ui/separator";

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = session.user as any;
  const isAdmin = user.role === "ADMIN";

  const [allBookings, myBookings] = await Promise.all([
    getUpcomingBookings(),
    getBookingsByUserId(session.user.id),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl font-bold text-foreground">Reservas de turnos</h1>
          <p className="text-sm text-muted-foreground mt-1">Seleccioná un día para reservar tu turno</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Calendar */}
          <BookingCalendar userId={session.user.id} isAdmin={isAdmin} />

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-4 shadow-sm space-y-4">
              <BookingList
                initialBookings={myBookings}
                currentUserId={session.user.id}
                isAdmin={isAdmin}
                title="Mis reservas"
                emptyMessage="No tenés reservas próximas"
              />

              {allBookings.filter((b) => b.userId !== session.user.id).length > 0 && (
                <>
                  <Separator />
                  <BookingList
                    initialBookings={allBookings.filter((b) => b.userId !== session.user.id)}
                    currentUserId={session.user.id}
                    isAdmin={isAdmin}
                    title="Otras reservas"
                    emptyMessage="No hay otras reservas"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
