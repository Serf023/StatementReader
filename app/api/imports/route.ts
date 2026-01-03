import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ExtractorService } from "@/lib/services/extractorService";
import { CategorizerService } from "@/lib/services/categorizerService";
import { SheetsWriterService } from "@/lib/services/sheetsWriterService";

const extractor = new ExtractorService();
const categorizer = new CategorizerService();
const sheetsWriter = new SheetsWriterService();

export async function POST(request: Request) {
  const body = await request.json();
  const { householdId, userId, fileName, fileType, fileSize } = body;

  const importRecord = await prisma.import.create({
    data: {
      householdId,
      userId,
      fileName,
      fileType,
      fileSize
    }
  });

  const extracted = await extractor.extract(fileName);

  const transactionsData = extracted.parsed.transactions.map((transaction) => {
    const categorized = categorizer.categorize(transaction);
    const needsReview =
      transaction.confidence < 0.85 || categorized.categoryConfidence < 0.8;

    return {
      importId: importRecord.id,
      date: new Date(transaction.date),
      description: transaction.description,
      merchant: transaction.merchant,
      amount: transaction.amount,
      category: categorized.category,
      confidence: transaction.confidence,
      categoryConfidence: categorized.categoryConfidence,
      needsReview
    };
  });

  await prisma.transaction.createMany({ data: transactionsData });
  await sheetsWriter.append(importRecord.id);

  return NextResponse.json({ importId: importRecord.id });
}
