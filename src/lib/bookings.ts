import { prisma } from "./prisma";
import { startOfDay } from "date-fns";
import type { BookingWithUser } from "@/types";

export async function getUpcomingBookings(): Promise<BookingWithUser[]> {
  const today = startOfDay(new Date());
  return prisma.booking.findMany({
    where: { bookingDate: { gte: today } },
    include: { user: { select: { id: true, username: true, flat: true, floor: true } } },
    orderBy: { bookingDate: "asc" },
  }) as Promise<BookingWithUser[]>;
}

export async function getBookingsByUserId(userId: string): Promise<BookingWithUser[]> {
  const today = startOfDay(new Date());
  return prisma.booking.findMany({
    where: { userId, bookingDate: { gte: today } },
    include: { user: { select: { id: true, username: true, flat: true, floor: true } } },
    orderBy: { bookingDate: "asc" },
  }) as Promise<BookingWithUser[]>;
}

export async function getBookingById(id: number) {
  return prisma.booking.findUnique({
    where: { id },
    include: { user: true },
  });
}

export async function createBooking(data: {
  userId: string;
  bookingDate: Date;
  shift: "MORNING" | "EVENING";
  shared: boolean;
}) {
  const date = startOfDay(data.bookingDate);
  const existing = await prisma.booking.findFirst({
    where: { bookingDate: date, shift: data.shift },
  });
  if (existing) throw new Error("SHIFT_TAKEN");

  return prisma.booking.create({
    data: { ...data, bookingDate: date },
    include: { user: { select: { id: true, username: true, flat: true, floor: true } } },
  });
}

export async function deleteBooking(id: number, requestingUserId: string, isAdmin: boolean) {
  const booking = await getBookingById(id);
  if (!booking) throw new Error("NOT_FOUND");
  if (booking.userId !== requestingUserId && !isAdmin) throw new Error("FORBIDDEN");
  await prisma.booking.delete({ where: { id } });
}
