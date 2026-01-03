import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Statement Reader MVP",
  description: "Scaffolded MVP with stub services"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <strong>Statement Reader</strong>
            <a href="/login">Login</a>
            <a href="/household">Household</a>
            <a href="/sheet">Sheet</a>
            <a href="/upload">Upload</a>
            <a href="/review">Review</a>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
