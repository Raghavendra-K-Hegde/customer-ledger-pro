"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

type Invoice={id:string;number:string;partyId:string;partyName:string;date:string;item:string;qty:number;rate:number;discount:number;total:number;paid:number;status:"Paid"|"Partial"|"Unpaid"};
type Party={id:string;name:string;phone:string;openingBalance:number};

const money=(n:number)=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);

export default function Dashboard(){
 const [invoices,setInvoices]=useState<Invoice[]>([]);
 const [parties,setParties]=useState<Party[]>([]);
 useEffect(()=>{
  try{setInvoices(JSON.parse(localStorage.getItem("raghdemo-ledger-invoices-v4")||"[]"));}catch{}
  try{setParties(JSON.parse(localStorage.getItem("raghdemo-ledger-parties-v4")||"[]"));}catch{}
 },[]);
 const stats=useMemo(()=>{
  const today=new Date().toISOString().slice(0,10);
  const sales=invoices.reduce((s,i)=>s+i.total,0);
  const received=invoices.reduce((s,i)=>s+i.paid,0);
  const due=invoices.reduce((s,i)=>s+Math.max(0,i.total-i.paid),0);
  const todaySales=invoices.filter(i=>i.date===today).reduce((s,i)=>s+i.total,0);
  return {sales,received,due,todaySales};
 },[invoices]);
 const recent=[...invoices].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,6);
 return <div className="app-shell"><Sidebar/><div className="app-main"><Topbar/><main className="dash">
  <div className="dash-head"><div><div className="eyebrow">BUSINESS OVERVIEW</div><h1>Good day 👋</h1><p>Here’s how your business is doing right now.</p></div><div className="quick-actions"><a className="btn primary" href="/sales/new">+ Sale Invoice</a><a className="btn" href="/ledger">+ Payment</a></div></div>
  <section className="metrics">
   <Metric label="Total Sales" value={money(stats.sales)} hint={money(stats.todaySales)+" today"}/>
   <Metric label="Received" value={money(stats.received)} hint="Customer collections"/>
   <Metric label="To Collect" value={money(stats.due)} hint={invoices.filter(i=>i.status!=="Paid").length+" open invoices"} warn/>
   <Metric label="Parties" value={String(parties.length)} hint="Customers & accounts"/>
  </section>
  <section className="action-grid">
   <a href="/sales/new"><b>＋</b><span>Sale Invoice</span><small>Create bill</small></a>
   <a href="/ledger"><b>₹</b><span>Payment In</span><small>Record collection</small></a>
   <a href="/customers"><b>♙</b><span>Add Party</span><small>Customer / supplier</small></a>
   <a href="/items"><b>▦</b><span>Add Item</span><small>Manage inventory</small></a>
  </section>
  <div className="dash-grid">
   <section className="panel"><div className="panel-title"><div><h2>Recent Sales</h2><p>Latest invoices and collections</p></div><a href="/sales">View all →</a></div>
    {recent.length===0?<div className="empty">No sales yet. Create your first invoice to see activity here.</div>:<div className="recent-list">{recent.map(i=><a href={"/sales/invoice/"+i.id} key={i.id}><div><strong>{i.partyName}</strong><small>{i.number} · {i.date}</small></div><div className="amount"><strong>{money(i.total)}</strong><small className={"status "+i.status.toLowerCase()}>{i.status}</small></div></a>)}</div>}
   </section>
   <section className="panel"><div className="panel-title"><div><h2>Receivables</h2><p>Money customers owe you</p></div></div><div className="receivable"><span>Outstanding</span><strong>{money(stats.due)}</strong><div className="bar"><i style={{width:(stats.sales?Math.min(100,stats.due/stats.sales*100):0)+"%"}}/></div><small>{stats.sales?Math.round(stats.due/stats.sales*100):0}% of invoiced sales pending</small></div><a className="report-link" href="/reports">Open Outstanding Report →</a></section>
  </div>
 </main><style>{css}</style></div></div>
}
function Metric({label,value,hint,warn}:{label:string;value:string;hint:string;warn?:boolean}){return <div className={"metric "+(warn?"warn":"")}><span>{label}</span><strong>{value}</strong><small>{hint}</small></div>}
const css=`
*{box-sizing:border-box}body{margin:0;background:#f7f8fa;color:#18212f;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.app-shell{display:flex;min-height:100vh}.app-main{flex:1;min-width:0}.dash{padding:30px;max-width:1450px;margin:auto}.dash-head{display:flex;justify-content:space-between;gap:24px;align-items:center;margin-bottom:26px}.eyebrow{font-size:11px;font-weight:800;letter-spacing:.13em;color:#be123c}.dash h1{font-size:28px;margin:5px 0}.dash-head p,.panel-title p{margin:0;color:#758092;font-size:13px}.quick-actions{display:flex;gap:10px}.btn{border:1px solid #dfe3e8;background:white;padding:10px 15px;border-radius:9px;text-decoration:none;color:#273244;font-size:13px;font-weight:700}.btn.primary{background:#be123c;color:white;border-color:#be123c}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.metric{background:white;border:1px solid #e9ebef;border-radius:13px;padding:18px;box-shadow:0 1px 2px #1018280a}.metric span{font-size:12px;color:#697586;font-weight:700}.metric strong{display:block;font-size:25px;margin:8px 0 4px}.metric small{color:#8b95a5}.metric.warn strong{color:#be123c}.action-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:18px 0}.action-grid a{background:white;border:1px solid #e9ebef;border-radius:11px;padding:14px;text-decoration:none;color:#273244;display:grid;grid-template-columns:36px 1fr;column-gap:10px}.action-grid b{grid-row:1/3;width:34px;height:34px;border-radius:9px;background:#fff1f3;color:#be123c;display:grid;place-items:center;font-size:17px}.action-grid span{font-size:13px;font-weight:800}.action-grid small{font-size:11px;color:#8a94a4;margin-top:2px}.dash-grid{display:grid;grid-template-columns:1.7fr 1fr;gap:16px}.panel{background:white;border:1px solid #e9ebef;border-radius:13px;padding:19px}.panel-title{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}.panel-title h2{font-size:16px;margin:0 0 3px}.panel-title a,.report-link{font-size:12px;color:#be123c;text-decoration:none;font-weight:700}.recent-list>a{display:flex;justify-content:space-between;align-items:center;padding:12px 2px;border-top:1px solid #f0f1f3;text-decoration:none;color:inherit}.recent-list small{display:block;color:#8993a3;font-size:11px;margin-top:3px}.amount{text-align:right}.status{font-weight:700}.status.paid{color:#16835d}.status.partial{color:#b26a00}.status.unpaid{color:#be123c}.empty{padding:34px 5px;color:#8a94a4;font-size:13px}.receivable{padding:12px 0 20px}.receivable span{font-size:12px;color:#7b8595}.receivable strong{display:block;font-size:30px;margin:7px 0 15px}.bar{height:7px;background:#f0f1f3;border-radius:10px;overflow:hidden}.bar i{display:block;height:100%;background:#be123c;border-radius:10px}.receivable small{display:block;margin-top:7px;color:#8a94a4}.report-link{display:block;border-top:1px solid #f0f1f3;padding-top:14px}@media(max-width:900px){.metrics,.action-grid{grid-template-columns:repeat(2,1fr)}.dash-grid{grid-template-columns:1fr}.dash{padding:18px}.dash-head{align-items:flex-start;flex-direction:column}}@media(max-width:600px){.metrics,.action-grid{grid-template-columns:1fr}.quick-actions{width:100%}.btn{flex:1;text-align:center}}
`;