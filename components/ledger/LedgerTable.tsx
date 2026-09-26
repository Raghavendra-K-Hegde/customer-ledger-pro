"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type EntryType = "debit" | "credit";
type Party = { id:string; name:string; phone:string; openingBalance:number };
type LedgerEntry = { id:string; partyId:string; date:string; reference:string; description:string; type:EntryType; amount:number };

const seedParties:Party[]=[
  {id:"p1",name:"Shree Ganesh Stores",phone:"9876543210",openingBalance:1500},
  {id:"p2",name:"Mahadev Traders",phone:"9845012345",openingBalance:0},
  {id:"p3",name:"Sri Lakshmi Enterprises",phone:"9900123456",openingBalance:2400},
];
const today=()=>new Date().toISOString().slice(0,10);
const seedEntries:LedgerEntry[]=[
  {id:"1",partyId:"p1",date:today(),reference:"INV001",description:"Sale invoice",type:"debit",amount:5000},
  {id:"2",partyId:"p1",date:today(),reference:"RCPT001",description:"Payment received",type:"credit",amount:2000},
];
const money=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2});
const PARTY_KEY="raghdemo-ledger-parties-v4", ENTRY_KEY="raghdemo-ledger-entries-v4";

export default function LedgerTable(){
  const [parties,setParties]=useState<Party[]>(seedParties);
  const [entries,setEntries]=useState<LedgerEntry[]>(seedEntries);
  const [selectedPartyId,setSelectedPartyId]=useState(seedParties[0].id);
  const [search,setSearch]=useState("");
  const [date,setDate]=useState(today());
  const [reference,setReference]=useState("");
  const [description,setDescription]=useState("");
  const [type,setType]=useState<EntryType>("debit");
  const [amount,setAmount]=useState("");
  const [partyName,setPartyName]=useState("");
  const [partyPhone,setPartyPhone]=useState("");
  const [openingBalance,setOpeningBalance]=useState("");
  const [hydrated,setHydrated]=useState(false);

  useEffect(()=>{
    try{
      const p=localStorage.getItem(PARTY_KEY), e=localStorage.getItem(ENTRY_KEY);
      if(p){const parsed=JSON.parse(p) as Party[];if(parsed.length){setParties(parsed);setSelectedPartyId(parsed[0].id);}}
      if(e)setEntries(JSON.parse(e));
    }catch{} finally{setHydrated(true);}
  },[]);
  useEffect(()=>{if(hydrated)localStorage.setItem(PARTY_KEY,JSON.stringify(parties));},[parties,hydrated]);
  useEffect(()=>{if(hydrated)localStorage.setItem(ENTRY_KEY,JSON.stringify(entries));},[entries,hydrated]);

  const selectedParty=parties.find(p=>p.id===selectedPartyId)??parties[0];
  const partyEntries=useMemo(()=>entries.filter(e=>e.partyId===selectedPartyId),[entries,selectedPartyId]);
  const rows=useMemo(()=>{
    let balance=selectedParty?.openingBalance??0;
    return partyEntries.map(entry=>{balance+=entry.type==="debit"?entry.amount:-entry.amount;return {...entry,balance};});
  },[partyEntries,selectedParty]);
  const filteredRows=rows.filter(row=>[row.reference,row.description,row.date].join(" ").toLowerCase().includes(search.toLowerCase()));
  const totals=useMemo(()=>{
    const debit=partyEntries.filter(e=>e.type==="debit").reduce((s,e)=>s+e.amount,0);
    const credit=partyEntries.filter(e=>e.type==="credit").reduce((s,e)=>s+e.amount,0);
    return {debit,credit,balance:(selectedParty?.openingBalance??0)+debit-credit};
  },[partyEntries,selectedParty]);
  const partyBalance=(id:string)=>{
    const p=parties.find(x=>x.id===id);return (p?.openingBalance??0)+entries.filter(e=>e.partyId===id).reduce((s,e)=>s+(e.type==="debit"?e.amount:-e.amount),0);
  };

  function addEntry(event:FormEvent){
    event.preventDefault();const value=Number(amount);
    if(!selectedPartyId||!date||!reference.trim()||!Number.isFinite(value)||value<=0)return;
    setEntries(current=>[...current,{id:crypto.randomUUID(),partyId:selectedPartyId,date,reference:reference.trim(),description:description.trim(),type,amount:value}]);
    setReference("");setDescription("");setAmount("");
  }
  function addParty(event:FormEvent){
    event.preventDefault();if(!partyName.trim())return;
    const p:Party={id:crypto.randomUUID(),name:partyName.trim(),phone:partyPhone.trim(),openingBalance:Number(openingBalance)||0};
    setParties(current=>[...current,p]);setSelectedPartyId(p.id);setPartyName("");setPartyPhone("");setOpeningBalance("");
  }
  function removeEntry(id:string){if(confirm("Delete this ledger entry?"))setEntries(current=>current.filter(e=>e.id!==id));}

  return <section>
    <div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"end",flexWrap:"wrap",marginBottom:20}}>
      <div><h1 style={{margin:"0 0 6px"}}>Party Ledger</h1><div style={{color:"#667085"}}>Customer-wise sales, receipts and outstanding balances.</div></div>
      <input aria-label="Search ledger" placeholder="Search transaction" value={search} onChange={e=>setSearch(e.target.value)} style={{...field,minWidth:260}}/>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"minmax(220px,280px) 1fr",gap:18,alignItems:"start"}}>
      <aside style={panel}>
        <h3 style={{marginTop:0}}>Parties</h3>
        <div style={{display:"grid",gap:7}}>
          {parties.map(p=><button key={p.id} onClick={()=>setSelectedPartyId(p.id)} style={{textAlign:"left",padding:11,borderRadius:8,border:p.id===selectedPartyId?"2px solid #101828":"1px solid #eaecf0",background:"#fff",cursor:"pointer"}}>
            <div style={{fontWeight:650}}>{p.name}</div><div style={{fontSize:12,color:"#667085",marginTop:3}}>{p.phone||"No phone"} · {money.format(partyBalance(p.id))}</div>
          </button>)}
        </div>
        <form onSubmit={addParty} style={{display:"grid",gap:8,marginTop:16,paddingTop:16,borderTop:"1px solid #eaecf0"}}>
          <strong>Add Party</strong>
          <input placeholder="Party name *" value={partyName} onChange={e=>setPartyName(e.target.value)} style={field} required/>
          <input placeholder="Phone" value={partyPhone} onChange={e=>setPartyPhone(e.target.value)} style={field}/>
          <input type="number" step="0.01" placeholder="Opening balance" value={openingBalance} onChange={e=>setOpeningBalance(e.target.value)} style={field}/>
          <button style={primary}>+ Add Party</button>
        </form>
      </aside>

      <div style={{minWidth:0}}>
        <div style={{marginBottom:14}}><h2 style={{margin:"0 0 4px"}}>{selectedParty?.name??"Select a party"}</h2><span style={{color:"#667085"}}>{selectedParty?.phone||"No phone number"} · Opening: {money.format(selectedParty?.openingBalance??0)}</span></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10,marginBottom:16}}>
          <Summary label="Debit / Sales" value={money.format(totals.debit)}/><Summary label="Credit / Received" value={money.format(totals.credit)}/><Summary label="Outstanding" value={money.format(totals.balance)}/>
        </div>
        <form onSubmit={addEntry} style={{...panel,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(135px,1fr))",gap:9,marginBottom:16}}>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} required style={field}/>
          <input placeholder="Reference *" value={reference} onChange={e=>setReference(e.target.value)} required style={field}/>
          <input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} style={field}/>
          <select value={type} onChange={e=>setType(e.target.value as EntryType)} style={field}><option value="debit">Sale / Debit</option><option value="credit">Payment Received</option></select>
          <input type="number" min="0.01" step="0.01" placeholder="Amount *" value={amount} onChange={e=>setAmount(e.target.value)} required style={field}/>
          <button type="submit" style={primary}>Add Entry</button>
        </form>
        <div style={{overflowX:"auto",...panel,padding:0}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:720}}>
            <thead><tr>{["Date","Reference","Description","Debit","Credit","Balance",""].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {filteredRows.map(row=><tr key={row.id}><td style={td}>{row.date}</td><td style={td}><strong>{row.reference}</strong></td><td style={td}>{row.description||"—"}</td><td style={td}>{row.type==="debit"?money.format(row.amount):"—"}</td><td style={td}>{row.type==="credit"?money.format(row.amount):"—"}</td><td style={td}><strong>{money.format(row.balance)}</strong></td><td style={td}><button onClick={()=>removeEntry(row.id)} style={linkButton}>Delete</button></td></tr>)}
              {!filteredRows.length&&<tr><td colSpan={7} style={{...td,textAlign:"center",color:"#667085",padding:28}}>No transactions for this party.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>;
}
function Summary({label,value}:{label:string;value:string}){return <div style={panel}><div style={{fontSize:12,color:"#667085"}}>{label}</div><div style={{fontSize:21,fontWeight:700,marginTop:5}}>{value}</div></div>;}
const panel={background:"#fff",border:"1px solid #eaecf0",borderRadius:10,padding:14};
const field={padding:"10px 11px",border:"1px solid #d0d5dd",borderRadius:8,minWidth:0};
const primary={border:0,borderRadius:8,padding:"10px 14px",background:"#101828",color:"#fff",fontWeight:650,cursor:"pointer"};
const linkButton={border:0,background:"transparent",cursor:"pointer",color:"#b42318"};
const th={textAlign:"left" as const,padding:"11px 12px",fontSize:12,color:"#475467",background:"#f9fafb",borderBottom:"1px solid #eaecf0"};
const td={padding:"12px",borderBottom:"1px solid #f2f4f7",fontSize:13};
