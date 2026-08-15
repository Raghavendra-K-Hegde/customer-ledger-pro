import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        padding: "40px",
        background: "#F5F6F8",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#E11D48" }}>RaghDemo Customer Ledger Pro</h1>
      <p>Vyapar-style cloud customer ledger.</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div style={{ background: "white", padding: 20, borderRadius: 12 }}>
          <h3>Today's Sales</h3>
          <h2>₹52,000</h2>
        </div>

        <div style={{ background: "white", padding: 20, borderRadius: 12 }}>
          <h3>Collections</h3>
          <h2>₹37,000</h2>
        </div>

        <div style={{ background: "white", padding: 20, borderRadius: 12 }}>
          <h3>Outstanding</h3>
          <h2>₹15,000</h2>
        </div>

        <div style={{ background: "white", padding: 20, borderRadius: 12 }}>
          <h3>Customers</h3>
          <h2>245</h2>
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <Link href="/dashboard">
          <button style={btnStyle}>Dashboard</button>
        </Link>

        <Link href="/sales">
          <button style={btnStyle}>New Sale</button>
        </Link>

        <Link href="/ledger">
          <button style={btnStyle}>Customer Ledger</button>
        </Link>
      </div>
    </main>
  );
}

const btnStyle = {
  marginRight: "12px",
  padding: "12px 22px",
  background: "#E11D48",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};