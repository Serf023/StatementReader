import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const transactions = await prisma.transaction.findMany({
    where: { needsReview: true },
    orderBy: { date: "desc" }
  });

  return NextResponse.json({
    transactions: transactions.map((transaction) => ({
      ...transaction,
      date: transaction.date.toISOString().slice(0, 10)
    }))
  });
}
