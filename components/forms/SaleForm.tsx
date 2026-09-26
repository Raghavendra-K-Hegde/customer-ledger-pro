"use client";
import {FormEvent,useEffect,useMemo,useState} from "react";

type Party={id:string;name:string;phone:string;openingBalance:number};
type Invoice={id:string;number:string;partyId:string;partyName:string;date:string;item:string;qty:number;rate:number;discount:number;total:number;paid:number;status:"Paid"|"Partial"|"Unpaid"};
const PARTY_KEY="raghdemo-ledger-parties-v4",ENTRY_KEY="raghdemo-ledger-entries-v4",INVOICE_KEY="raghdemo-ledger-invoices-v4";
const money=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2});

export default function SaleForm(){
 const [parties,setParties]=useState<Party[]>([]),[partyId,setPartyId]=useState(""),[date,setDate]=useState(new Date().toISOString().slice(0,10));
 const [item,setItem]=useState(""),[qty,setQty]=useState("1"),[rate,setRate]=useState(""),[discount,setDiscount]=useState("0"),[paid,setPaid]=useState("0"),[message,setMessage]=useState("");
 useEffect(()=>{try{const p=JSON.parse(localStorage.getItem(PARTY_KEY)||"[]") as Party[];setParties(p);if(p.length)setPartyId(p[0].id);}catch{}},[]);
 const total=useMemo(()=>Math.max(0,(Number(qty)||0)*(Number(rate)||0)-(Number(discount)||0)),[qty,rate,discount]);
 function save(e:FormEvent){e.preventDefault();const party=parties.find(p=>p.id===partyId),payment=Math.min(Math.max(Number(paid)||0,0),total);if(!party||!item.trim()||total<=0)return;
  const invoices=JSON.parse(localStorage.getItem(INVOICE_KEY)||"[]") as Invoice[];const number="INV"+String(invoices.length+1).padStart(4,"0");
  const invoice:Invoice={id:crypto.randomUUID(),number,partyId,partyName:party.name,date,item:item.trim(),qty:Number(qty),rate:Number(rate),discount:Number(discount)||0,total,paid:payment,status:payment>=total?"Paid":payment>0?"Partial":"Unpaid"};
  localStorage.setItem(INVOICE_KEY,JSON.stringify([...invoices,invoice]));
  const entries=JSON.parse(localStorage.getItem(ENTRY_KEY)||"[]");
  entries.push({id:crypto.randomUUID(),partyId,date,reference:number,description:"Sale: "+item.trim(),type:"debit",amount:total});
  if(payment>0)entries.push({id:crypto.randomUUID(),partyId,date,reference:"PAY-"+number,description:"Payment against "+number,type:"credit",amount:payment});
  localStorage.setItem(ENTRY_KEY,JSON.stringify(entries));setMessage(number+" saved — "+invoice.status+" · "+money.format(total-payment)+" due");setItem("");setQty("1");setRate("");setDiscount("0");setPaid("0");
 }
 return <form onSubmit={save} style={{display:"grid",gap:12,background:"#fff",border:"1px solid #eaecf0",borderRadius:12,padding:20}}>
  <div><h2 style={{margin:"0 0 4px"}}>New Sale</h2><span style={{color:"#667085"}}>Saving an invoice automatically posts it to the party ledger.</span></div>
  {!parties.length&&<div style={{padding:12,background:"#fffaeb",borderRadius:8}}>Add a party from Ledger before creating a sale.</div>}
  <label>Customer<select value={partyId} onChange={e=>setPartyId(e.target.value)} style={field} required><option value="">Select customer</option>{parties.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
  <label>Date<input type="date" value={date} onChange={e=>setDate(e.target.value)} style={field} required/></label>
  <label>Item / Description<input value={item} onChange={e=>setItem(e.target.value)} placeholder="Product or service" style={field} required/></label>
  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}><label>Quantity<input type="number" min="1" step="1" value={qty} onChange={e=>setQty(e.target.value)} style={field}/></label><label>Rate<input type="number" min="0.01" step="0.01" value={rate} onChange={e=>setRate(e.target.value)} style={field} required/></label></div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}><label>Discount ₹<input type="number" min="0" step="0.01" value={discount} onChange={e=>setDiscount(e.target.value)} style={field}/></label><label>Payment received ₹<input type="number" min="0" step="0.01" value={paid} onChange={e=>setPaid(e.target.value)} style={field}/></label></div>
  <div style={{display:"flex",justifyContent:"space-between",padding:"14px 0",borderTop:"1px solid #eaecf0",fontSize:18}}><strong>Invoice Total</strong><strong>{money.format(total)}</strong></div>
  <button disabled={!parties.length} style={button}>Save Invoice & Post to Ledger</button>{message&&<div style={{padding:12,background:"#ecfdf3",borderRadius:8}}>{message}</div>}
 </form>
}
const field={display:"block",width:"100%",boxSizing:"border-box" as const,marginTop:5,padding:"10px 11px",border:"1px solid #d0d5dd",borderRadius:8};
const button={border:0,borderRadius:8,padding:"12px 16px",background:"#101828",color:"#fff",fontWeight:650,cursor:"pointer"};
