import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, parseISO } from "date-fns";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const page   = Math.max(1, Number(searchParams.get("page") ?? 1));
  const shift  = searchParams.get("shift");
  const from   = searchParams.get("from");
  const to     = searchParams.get("to");

  const where: any = {};
  if (shift === "MORNING" || shift === "EVENING") where.shift = shift;
  if (from || to) {
    where.bookingDate = {};
    if (from) where.bookingDate.gte = startOfDay(parseISO(from));
    if (to)   where.bookingDate.lte = endOfDay(parseISO(to));
  }

  const [total, bookings] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      include: { user: { select: { id: true, username: true, flat: true, floor: true } } },
      orderBy: { bookingDate: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return NextResponse.json({ bookings, total, page, pageSize: PAGE_SIZE, totalPages: Math.ceil(total / PAGE_SIZE) });
}
