"use client";
import {FormEvent,useEffect,useMemo,useState} from "react";import Sidebar from "../../components/layout/Sidebar";import Topbar from "../../components/layout/Topbar";
type Status="Paid"|"Partial"|"Unpaid";type Invoice={id:string;number:string;partyId:string;partyName:string;date:string;item:string;total:number;paid:number;status:Status};
type Entry={id:string;partyId:string;date:string;reference:string;description:string;type:"debit"|"credit";amount:number};
const KEY="raghdemo-ledger-invoices-v4",ENTRY_KEY="raghdemo-ledger-entries-v4";const money=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2});
export default function Sales(){
 const [rows,setRows]=useState<Invoice[]>([]),[paying,setPaying]=useState<Invoice|null>(null),[amount,setAmount]=useState(""),[method,setMethod]=useState("Cash"),[reference,setReference]=useState(""),[notice,setNotice]=useState("");
 useEffect(()=>{try{setRows(JSON.parse(localStorage.getItem(KEY)||"[]"))}catch{}},[]);
 const totalDue=useMemo(()=>rows.reduce((s,x)=>s+Math.max(0,x.total-x.paid),0),[rows]);
 function openPayment(x:Invoice){setPaying(x);setAmount(String(Math.max(0,x.total-x.paid)));setMethod("Cash");setReference("");setNotice("");}
 function receive(e:FormEvent){e.preventDefault();if(!paying)return;const due=Math.max(0,paying.total-paying.paid),value=Number(amount);if(!Number.isFinite(value)||value<=0||value>due)return;
  const next=rows.map(x=>x.id===paying.id?{...x,paid:x.paid+value,status:(x.paid+value>=x.total?"Paid":"Partial") as Status}:x);setRows(next);localStorage.setItem(KEY,JSON.stringify(next));
  const entries=JSON.parse(localStorage.getItem(ENTRY_KEY)||"[]") as Entry[];entries.push({id:crypto.randomUUID(),partyId:paying.partyId,date:new Date().toISOString().slice(0,10),reference:reference.trim()||"PAY-"+paying.number,description:method+" payment against "+paying.number,type:"credit",amount:value});localStorage.setItem(ENTRY_KEY,JSON.stringify(entries));
  setNotice(money.format(value)+" received for "+paying.number);setPaying(null);
 }
 return <div style={{display:"flex",minHeight:"100vh",background:"#F5F6F8"}}><Sidebar/><div style={{flex:1,minWidth:0}}><Topbar/><main style={{padding:24}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:14,flexWrap:"wrap",marginBottom:18}}><div><h1 style={{margin:0}}>Sales</h1><p style={{color:"#667085"}}>{rows.length} invoices · {money.format(totalDue)} outstanding</p></div><a href="/sales/new" style={newSale}>+ New Sale</a></div>
  {notice&&<div style={{padding:12,background:"#ecfdf3",borderRadius:8,marginBottom:14}}>{notice}</div>}
  <div style={{overflowX:"auto",background:"#fff",border:"1px solid #eaecf0",borderRadius:10}}><table style={{width:"100%",borderCollapse:"collapse",minWidth:860}}><thead><tr>{["Invoice","Date","Customer","Item","Total","Paid","Due","Status",""].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead><tbody>
   {rows.slice().reverse().map(x=><tr key={x.id}><td style={td}><a href={"/sales/invoice/"+x.id} style={{color:"#101828",fontWeight:700}}>{x.number}</a></td><td style={td}>{x.date}</td><td style={td}>{x.partyName}</td><td style={td}>{x.item}</td><td style={td}>{money.format(x.total)}</td><td style={td}>{money.format(x.paid)}</td><td style={td}>{money.format(Math.max(0,x.total-x.paid))}</td><td style={td}><span style={badge(x.status)}>{x.status}</span></td><td style={td}>{x.status!=="Paid"&&<button onClick={()=>openPayment(x)} style={payButton}>Receive Payment</button>}</td></tr>)}
   {!rows.length&&<tr><td colSpan={9} style={{...td,textAlign:"center",padding:30,color:"#667085"}}>No invoices yet. Create your first sale.</td></tr>}
  </tbody></table></div>
  {paying&&<div style={overlay} onMouseDown={()=>setPaying(null)}><form onSubmit={receive} onMouseDown={e=>e.stopPropagation()} style={modal}>
    <div><h2 style={{margin:"0 0 4px"}}>Receive Payment</h2><div style={{color:"#667085"}}>{paying.number} · {paying.partyName}</div></div>
    <div style={{display:"flex",justifyContent:"space-between",padding:12,background:"#f9fafb",borderRadius:8}}><span>Amount due</span><strong>{money.format(Math.max(0,paying.total-paying.paid))}</strong></div>
    <label>Amount<input autoFocus type="number" min="0.01" max={Math.max(0,paying.total-paying.paid)} step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} style={field} required/></label>
    <label>Payment method<select value={method} onChange={e=>setMethod(e.target.value)} style={field}><option>Cash</option><option>UPI</option><option>NEFT</option><option>Cheque</option><option>Credit Card</option><option>Debit Card</option></select></label>
    <label>Reference / UTR<input value={reference} onChange={e=>setReference(e.target.value)} placeholder="Optional" style={field}/></label>
    <div style={{display:"flex",justifyContent:"flex-end",gap:8}}><button type="button" onClick={()=>setPaying(null)} style={cancel}>Cancel</button><button style={payButton}>Save Payment</button></div>
  </form></div>}
 </main></div></div>
}
function badge(s:Status){return {display:"inline-block",padding:"4px 8px",borderRadius:20,fontSize:12,fontWeight:650,background:s==="Paid"?"#ecfdf3":s==="Partial"?"#fffaeb":"#fef3f2"}}
const newSale={padding:"10px 14px",background:"#101828",color:"#fff",borderRadius:8,textDecoration:"none",fontWeight:600};const payButton={border:0,borderRadius:7,padding:"8px 11px",background:"#101828",color:"#fff",fontWeight:600,cursor:"pointer"};const cancel={border:"1px solid #d0d5dd",borderRadius:7,padding:"8px 11px",background:"#fff",cursor:"pointer"};const field={display:"block",width:"100%",boxSizing:"border-box" as const,marginTop:5,padding:"10px 11px",border:"1px solid #d0d5dd",borderRadius:8};const overlay={position:"fixed" as const,inset:0,background:"rgba(16,24,40,.45)",display:"grid",placeItems:"center",padding:20,zIndex:50};const modal={width:"min(430px,100%)",display:"grid",gap:14,background:"#fff",borderRadius:12,padding:20,boxShadow:"0 20px 50px rgba(0,0,0,.18)"};const th={textAlign:"left" as const,padding:12,fontSize:12,color:"#475467",background:"#f9fafb",borderBottom:"1px solid #eaecf0"};const td={padding:12,borderBottom:"1px solid #f2f4f7",fontSize:13};
