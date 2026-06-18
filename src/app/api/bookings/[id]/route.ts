import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { deleteBooking } from "@/lib/bookings";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const isAdmin = (session.user as any).role === "ADMIN";

  try {
    await deleteBooking(id, session.user.id, isAdmin);
    return new NextResponse(null, { status: 204 });
  } catch (e: any) {
    if (e.message === "NOT_FOUND") return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    if (e.message === "FORBIDDEN") return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
