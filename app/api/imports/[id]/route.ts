import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const importRecord = await prisma.import.findUnique({
    where: { id: params.id },
    include: { transactions: true }
  });

  if (!importRecord) {
    return NextResponse.json({ import: null }, { status: 404 });
  }

  return NextResponse.json({
    import: {
      ...importRecord,
      transactions: importRecord.transactions.map((transaction) => ({
        ...transaction,
        date: transaction.date.toISOString().slice(0, 10)
      }))
    }
  });
}
