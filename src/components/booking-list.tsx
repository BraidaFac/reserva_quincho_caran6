"use client";
import { useState } from "react";
import { BookingCard } from "./booking-card";
import type { BookingWithUser } from "@/types";

interface Props {
  initialBookings: BookingWithUser[];
  currentUserId: string;
  isAdmin: boolean;
  title: string;
  emptyMessage: string;
}

export function BookingList({ initialBookings, currentUserId, isAdmin, title, emptyMessage }: Props) {
  const [bookings, setBookings] = useState(initialBookings);

  function handleDeleted(id: string) {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-lg text-foreground">{title}</h2>
      {bookings.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">{emptyMessage}</p>
      ) : (
        bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
            onDeleted={handleDeleted}
          />
        ))
      )}
    </div>
  );
}
