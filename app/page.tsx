export default function Home() {
  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        background: "#f5f6f9",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#E11D48" }}>RaghDemo</h1>
      <h2>Customer Ledger Pro</h2>

      <p>Your website is now running on Next.js.</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div style={{ background: "white", padding: "20px", borderRadius: "12px" }}>
          <h3>Today's Sales</h3>
          <h2>₹52,000</h2>
        </div>

        <div style={{ background: "white", padding: "20px", borderRadius: "12px" }}>
          <h3>Collections</h3>
          <h2>₹37,000</h2>
        </div>

        <div style={{ background: "white", padding: "20px", borderRadius: "12px" }}>
          <h3>Outstanding</h3>
          <h2>₹15,000</h2>
        </div>
      </div>
    </main>
  );
}
