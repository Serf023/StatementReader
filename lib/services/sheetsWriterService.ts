import { prisma } from "@/lib/db";

export class SheetsWriterService {
  async append(importId: string) {
    await prisma.import.update({
      where: { id: importId },
      data: { appendedAt: new Date() }
    });

    return {
      appendedRows: true,
      appendedAt: new Date().toISOString()
    };
  }
}
