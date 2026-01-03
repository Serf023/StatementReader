import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ households: [] });
  }

  const memberships = await prisma.householdMember.findMany({
    where: { userId },
    include: { household: true }
  });

  return NextResponse.json({
    households: memberships.map((member) => member.household)
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const household = await prisma.household.create({
    data: {
      name: body.name,
      members: {
        create: {
          userId: body.userId,
          role: "owner"
        }
      }
    }
  });

  return NextResponse.json({ household });
}
