import Ajv from "ajv";
import parsedStatementSchema from "../schema/parsedStatement.schema.json";

export type ParsedTransaction = {
  date: string;
  description: string;
  amount: number;
  merchant: string;
  confidence: number;
  category_confidence: number;
};

export type ParsedStatement = {
  statementId: string;
  period: {
    start: string;
    end: string;
  };
  transactions: ParsedTransaction[];
};

export type ExtractedResult = {
  parsed: ParsedStatement;
  confidence: number;
};

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(parsedStatementSchema);

const mockTransactions: ParsedTransaction[] = [
  {
    date: "2024-08-01",
    description: "Coffee Shop Latte",
    amount: -5.75,
    merchant: "Brewed Awakenings",
    confidence: 0.92,
    category_confidence: 0.88
  },
  {
    date: "2024-08-02",
    description: "Grocery Market",
    amount: -82.13,
    merchant: "Fresh Valley Market",
    confidence: 0.9,
    category_confidence: 0.91
  },
  {
    date: "2024-08-03",
    description: "Gym Membership",
    amount: -45.0,
    merchant: "Flex Fitness",
    confidence: 0.86,
    category_confidence: 0.77
  },
  {
    date: "2024-08-04",
    description: "Online Subscription",
    amount: -12.99,
    merchant: "Streamly",
    confidence: 0.8,
    category_confidence: 0.7
  },
  {
    date: "2024-08-05",
    description: "Paycheck",
    amount: 1850.0,
    merchant: "Acme Payroll",
    confidence: 0.98,
    category_confidence: 0.93
  }
];

export class ExtractorService {
  async extract(fileName: string): Promise<ExtractedResult> {
    const parsed: ParsedStatement = {
      statementId: `mock-${fileName.replace(/\s+/g, "-").toLowerCase()}`,
      period: {
        start: "2024-08-01",
        end: "2024-08-31"
      },
      transactions: mockTransactions
    };

    const valid = validate(parsed);
    if (!valid) {
      throw new Error(
        `ParsedStatement mock failed validation: ${ajv.errorsText(validate.errors)}`
      );
    }

    return {
      parsed,
      confidence: 0.91
    };
  }
}
