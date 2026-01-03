import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const user = await prisma.user.upsert({
    where: { id: body.id },
    update: { name: body.name, email: body.email },
    create: { id: body.id, name: body.name, email: body.email }
  });

  return NextResponse.json({ user });
}
