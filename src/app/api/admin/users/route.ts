import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      flat: true,
      floor: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  /*  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } */
  const { username, email, password, flat, floor, role } = await req.json();
  if (!username || !password || !flat || !floor) {
    return NextResponse.json(
      { error: "Todos los campos son requeridos" },
      { status: 400 },
    );
  }

  try {
    const resolvedEmail = email?.trim() || `${username}@noemail.local`;
    const data = await auth.api.signUpEmail({
      body: {
        email: resolvedEmail,
        password,
        name: username,
        username,
        flat,
        floor,
        role: role ?? "USER",
      },
    });
    return NextResponse.json(data, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Error al crear el usuario" },
      { status: 400 },
    );
  }
}
