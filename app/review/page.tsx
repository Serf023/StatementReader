"use client";

import { useEffect, useState } from "react";

type ReviewTransaction = {
  id: string;
  date: string;
  merchant: string;
  description: string;
  amount: number;
  category: string;
  importId: string;
};

export default function ReviewPage() {
  const [transactions, setTransactions] = useState<ReviewTransaction[]>([]);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/transactions/review");
      const data = await response.json();
      setTransactions(data.transactions ?? []);
    };
    load();
  }, []);

  return (
    <section>
      <div className="card">
        <h1>Review Queue</h1>
        <p className="small">
          Mock transactions flagged for review based on confidence.
        </p>
      </div>
      <div className="card">
        {transactions.length === 0 ? (
          <p className="small">No transactions need review.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Merchant</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Import</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.date}</td>
                  <td>{transaction.merchant}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.amount.toFixed(2)}</td>
                  <td>{transaction.category}</td>
                  <td>
                    <a href={`/imports/${transaction.importId}`}>
                      {transaction.importId}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
