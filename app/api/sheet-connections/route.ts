import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const householdId = searchParams.get("householdId");

  if (!householdId) {
    return NextResponse.json({ connections: [] });
  }

  const connections = await prisma.sheetConnection.findMany({
    where: { householdId }
  });

  return NextResponse.json({ connections });
}

export async function POST(request: Request) {
  const body = await request.json();
  const connection = await prisma.sheetConnection.create({
    data: {
      householdId: body.householdId,
      spreadsheetId: body.spreadsheetId,
      tabPrefix: body.tabPrefix
    }
  });

  return NextResponse.json({ connection });
}
