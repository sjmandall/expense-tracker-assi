// app/layout.js
import "./globals.css";

export const metadata = {
  title: "Expense Tracker",
  description: "Track your daily spending",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
