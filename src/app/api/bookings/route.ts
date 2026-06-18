import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUpcomingBookings, createBooking } from "@/lib/bookings";
import { startOfDay } from "date-fns";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bookings = await getUpcomingBookings();
  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { shift, bookingDate, shared = false } = body;

  if (!shift || !bookingDate || (shift !== "MORNING" && shift !== "EVENING")) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  try {
    const booking = await createBooking({
      userId: session.user.id,
      bookingDate: startOfDay(new Date(bookingDate)),
      shift,
      shared,
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (e: any) {
    if (e.message === "SHIFT_TAKEN") {
      return NextResponse.json({ error: "Turno ya reservado" }, { status: 409 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
