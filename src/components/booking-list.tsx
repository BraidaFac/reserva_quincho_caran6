"use client";
import { BookingCard } from "./booking-card";
import type { BookingWithUser } from "@/types";

interface Props {
  bookings: BookingWithUser[];
  currentUserId: string;
  isAdmin: boolean;
  title: string;
  emptyMessage: string;
  onDeleted: (id: number) => void;
}

export function BookingList({ bookings, currentUserId, isAdmin, title, emptyMessage, onDeleted }: Props) {
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
            onDeleted={onDeleted}
          />
        ))
      )}
    </div>
  );
}
