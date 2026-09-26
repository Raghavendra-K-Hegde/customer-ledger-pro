"use client";

import { FormEvent, useMemo, useState } from "react";

type EntryType = "debit" | "credit";
type LedgerEntry = {
  id: string;
  date: string;
  reference: string;
  description: string;
  type: EntryType;
  amount: number;
};

const initialEntries: LedgerEntry[] = [
  { id: "1", date: new Date().toISOString().slice(0, 10), reference: "INV001", description: "Sale invoice", type: "debit", amount: 5000 },
  { id: "2", date: new Date().toISOString().slice(0, 10), reference: "RCPT001", description: "Payment received", type: "credit", amount: 2000 },
];

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });

export default function LedgerTable() {
  const [entries, setEntries] = useState<LedgerEntry[]>(initialEntries);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<EntryType>("debit");
  const [amount, setAmount] = useState("");

  const rows = useMemo(() => {
    let balance = 0;
    return entries.map((entry) => {
      balance += entry.type === "debit" ? entry.amount : -entry.amount;
      return { ...entry, balance };
    });
  }, [entries]);

  const filteredRows = rows.filter((row) =>
    [row.reference, row.description, row.date].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const totals = useMemo(() => {
    const debit = entries.filter((e) => e.type === "debit").reduce((sum, e) => sum + e.amount, 0);
    const credit = entries.filter((e) => e.type === "credit").reduce((sum, e) => sum + e.amount, 0);
    return { debit, credit, balance: debit - credit };
  }, [entries]);

  function addEntry(event: FormEvent) {
    event.preventDefault();
    const value = Number(amount);
    if (!date || !reference.trim() || !Number.isFinite(value) || value <= 0) return;
    setEntries((current) => [...current, {
      id: String(Date.now()), date, reference: reference.trim(),
      description: description.trim(), type, amount: value,
    }]);
    setReference(""); setDescription(""); setAmount("");
  }

  function removeEntry(id: string) {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  }

  return <section>
    <div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"end",flexWrap:"wrap",marginBottom:20}}>
      <div><h1 style={{margin:"0 0 6px"}}>Customer Ledger</h1><div style={{color:"#667085"}}>Track invoices, receipts and the running outstanding balance.</div></div>
      <input aria-label="Search ledger" placeholder="Search reference or description" value={search} onChange={(e)=>setSearch(e.target.value)}
        style={{padding:"10px 12px",minWidth:280,border:"1px solid #d0d5dd",borderRadius:8}}/>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12,marginBottom:20}}>
      <Summary label="Total Debit" value={money.format(totals.debit)}/>
      <Summary label="Total Credit" value={money.format(totals.credit)}/>
      <Summary label="Outstanding" value={money.format(totals.balance)}/>
    </div>

    <form onSubmit={addEntry} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10,padding:16,background:"#fff",border:"1px solid #eaecf0",borderRadius:10,marginBottom:20}}>
      <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} required style={field}/>
      <input placeholder="Reference *" value={reference} onChange={(e)=>setReference(e.target.value)} required style={field}/>
      <input placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} style={field}/>
      <select value={type} onChange={(e)=>setType(e.target.value as EntryType)} style={field}><option value="debit">Debit / Sale</option><option value="credit">Credit / Receipt</option></select>
      <input type="number" min="0.01" step="0.01" placeholder="Amount *" value={amount} onChange={(e)=>setAmount(e.target.value)} required style={field}/>
      <button type="submit" style={{border:0,borderRadius:8,padding:"10px 16px",background:"#101828",color:"#fff",fontWeight:600,cursor:"pointer"}}>Add Entry</button>
    </form>

    <div style={{overflowX:"auto",background:"#fff",border:"1px solid #eaecf0",borderRadius:10}}>
      <table style={{width:"100%",borderCollapse:"collapse",minWidth:760}}>
        <thead><tr>{["Date","Reference","Description","Debit","Credit","Balance",""].map((h)=><th key={h} style={th}>{h}</th>)}</tr></thead>
        <tbody>
          {filteredRows.map((row)=><tr key={row.id}>
            <td style={td}>{row.date}</td><td style={td}><strong>{row.reference}</strong></td><td style={td}>{row.description || "—"}</td>
            <td style={td}>{row.type==="debit"?money.format(row.amount):"—"}</td>
            <td style={td}>{row.type==="credit"?money.format(row.amount):"—"}</td>
            <td style={td}><strong>{money.format(row.balance)}</strong></td>
            <td style={td}><button onClick={()=>removeEntry(row.id)} style={{border:0,background:"transparent",cursor:"pointer"}} aria-label={"Delete "+row.reference}>Delete</button></td>
          </tr>)}
          {!filteredRows.length && <tr><td colSpan={7} style={{...td,textAlign:"center",color:"#667085",padding:28}}>No ledger entries found.</td></tr>}
        </tbody>
      </table>
    </div>
  </section>;
}

function Summary({label,value}:{label:string;value:string}) {
  return <div style={{background:"#fff",border:"1px solid #eaecf0",borderRadius:10,padding:16}}><div style={{fontSize:13,color:"#667085"}}>{label}</div><div style={{fontSize:24,fontWeight:700,marginTop:5}}>{value}</div></div>;
}

const field = {padding:"10px 12px",border:"1px solid #d0d5dd",borderRadius:8,minWidth:0};
const th = {textAlign:"left" as const,padding:"12px 14px",fontSize:13,color:"#475467",background:"#f9fafb",borderBottom:"1px solid #eaecf0"};
const td = {padding:"13px 14px",borderBottom:"1px solid #f2f4f7",fontSize:14};
