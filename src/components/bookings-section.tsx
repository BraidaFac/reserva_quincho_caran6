"use client";
import { useState, useCallback } from "react";
import { BookingCalendar } from "./booking-calendar";
import { BookingList } from "./booking-list";
import { Separator } from "./ui/separator";
import { parseBookingDate } from "@/lib/utils";
import type { BookingWithUser } from "@/types";

interface Props {
  userId: string;
  isAdmin: boolean;
  initialBookings: BookingWithUser[];
}

export function BookingsSection({ userId, isAdmin, initialBookings }: Props) {
  const normalize = (list: any[]) =>
    list.map((b) => ({ ...b, bookingDate: parseBookingDate(b.bookingDate) }));

  const [bookings, setBookings] = useState<BookingWithUser[]>(() => normalize(initialBookings));

  const refresh = useCallback(async () => {
    const res = await fetch("/api/bookings");
    if (res.ok) setBookings(normalize(await res.json()));
  }, []);

  function handleDeleted(id: number) {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }

  const myBookings = bookings.filter((b) => b.userId === userId);
  const otherBookings = bookings.filter((b) => b.userId !== userId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
      <BookingCalendar
        userId={userId}
        isAdmin={isAdmin}
        bookings={bookings}
        onRefresh={refresh}
      />

      <div className="space-y-6">
        <div className="rounded-xl border bg-card p-4 shadow-sm space-y-4">
          <BookingList
            bookings={myBookings}
            currentUserId={userId}
            isAdmin={isAdmin}
            title="Mis reservas"
            emptyMessage="No tenés reservas próximas"
            onDeleted={handleDeleted}
          />
          {otherBookings.length > 0 && (
            <>
              <Separator />
              <BookingList
                bookings={otherBookings}
                currentUserId={userId}
                isAdmin={isAdmin}
                title="Otras reservas"
                emptyMessage="No hay otras reservas"
                onDeleted={handleDeleted}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
