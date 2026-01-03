import type { ParsedTransaction } from "./extractorService";

const categories = [
  "Groceries",
  "Dining",
  "Fitness",
  "Entertainment",
  "Income",
  "Utilities",
  "Shopping"
];

const hashString = (value: string) =>
  value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

export class CategorizerService {
  categorize(transaction: ParsedTransaction) {
    const index = hashString(transaction.merchant) % categories.length;
    return {
      category: categories[index],
      categoryConfidence: Math.max(0.7, transaction.category_confidence)
    };
  }
}
