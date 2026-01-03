"use client";

import { useEffect, useState } from "react";

type Transaction = {
  id: string;
  date: string;
  description: string;
  merchant: string;
  amount: number;
  category: string;
  needsReview: boolean;
};

type ImportDetail = {
  id: string;
  fileName: string;
  status: string;
  createdAt: string;
  transactions: Transaction[];
};

export default function ImportDetailPage({
  params
}: {
  params: { id: string };
}) {
  const [detail, setDetail] = useState<ImportDetail | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await fetch(`/api/imports/${params.id}`);
      const data = await response.json();
      setDetail(data.import);
    };
    load();
  }, [params.id]);

  if (!detail) {
    return (
      <section className="card">
        <h1>Import</h1>
        <p className="small">Loading import details...</p>
      </section>
    );
  }

  return (
    <section>
      <div className="card">
        <h1>Import {detail.id}</h1>
        <p className="small">
          File: {detail.fileName} · Status: {detail.status}
        </p>
        <p className="small">
          Created: {new Date(detail.createdAt).toLocaleString()}
        </p>
      </div>
      <div className="card">
        <h2>Extracted transactions</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Merchant</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
            {detail.transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>{transaction.merchant}</td>
                <td>{transaction.description}</td>
                <td>{transaction.amount.toFixed(2)}</td>
                <td>{transaction.category}</td>
                <td>
                  {transaction.needsReview ? (
                    <span className="badge">Needs review</span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
