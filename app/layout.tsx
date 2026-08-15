export const metadata = {
  title: "RaghDemo Customer Ledger Pro",
  description: "Vyapar-style Customer Ledger",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "Segoe UI, Arial, sans-serif",
          background: "#F5F6F8",
        }}
      >
        {children}
      </body>
    </html>
  );
}