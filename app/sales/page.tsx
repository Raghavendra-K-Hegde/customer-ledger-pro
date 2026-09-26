"use client";
import {useEffect,useState} from "react";import Sidebar from "../../components/layout/Sidebar";import Topbar from "../../components/layout/Topbar";
type Invoice={id:string;number:string;partyName:string;date:string;item:string;total:number;paid:number;status:"Paid"|"Partial"|"Unpaid"};
const KEY="raghdemo-ledger-invoices-v4";const money=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR"});
export default function Sales(){const [rows,setRows]=useState<Invoice[]>([]);useEffect(()=>{try{setRows(JSON.parse(localStorage.getItem(KEY)||"[]"))}catch{}},[]);
return <div style={{display:"flex",minHeight:"100vh",background:"#F5F6F8"}}><Sidebar/><div style={{flex:1,minWidth:0}}><Topbar/><main style={{padding:24}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><div><h1 style={{margin:0}}>Sales</h1><p style={{color:"#667085"}}>Invoices and payment status.</p></div><a href="/sales/new" style={{padding:"10px 14px",background:"#101828",color:"#fff",borderRadius:8,textDecoration:"none",fontWeight:600}}>+ New Sale</a></div>
<div style={{overflowX:"auto",background:"#fff",border:"1px solid #eaecf0",borderRadius:10}}><table style={{width:"100%",borderCollapse:"collapse",minWidth:720}}><thead><tr>{["Invoice","Date","Customer","Item","Total","Paid","Due","Status"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead><tbody>
{rows.slice().reverse().map(x=><tr key={x.id}><td style={td}><strong>{x.number}</strong></td><td style={td}>{x.date}</td><td style={td}>{x.partyName}</td><td style={td}>{x.item}</td><td style={td}>{money.format(x.total)}</td><td style={td}>{money.format(x.paid)}</td><td style={td}>{money.format(x.total-x.paid)}</td><td style={td}><strong>{x.status}</strong></td></tr>)}
{!rows.length&&<tr><td colSpan={8} style={{...td,textAlign:"center",padding:30,color:"#667085"}}>No invoices yet. Create your first sale.</td></tr>}</tbody></table></div>
</main></div></div>}
const th={textAlign:"left" as const,padding:12,fontSize:12,color:"#475467",background:"#f9fafb",borderBottom:"1px solid #eaecf0"};const td={padding:12,borderBottom:"1px solid #f2f4f7",fontSize:13};
