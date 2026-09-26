"use client";
import {ChangeEvent,useEffect,useRef,useState} from "react";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

const LAST_BACKUP="raghdemo-ledger-last-backup";
const WEEK=7*24*60*60*1000;
const settings=[["Business Profile","RaghDemo Traders","Business name, address and GST details"],["Invoice Settings","INV0001","Prefix, numbering and payment terms"],["Taxes & GST","GST enabled · Karnataka","Default tax rates and place of supply"],["Payment Methods","Cash · UPI · Bank","Methods shown while collecting payments"],["Inventory","Low-stock alerts enabled","Stock behaviour and warning thresholds"]];

export default function Settings(){
 const [last,setLast]=useState("");const [message,setMessage]=useState("");const input=useRef<HTMLInputElement>(null);
 useEffect(()=>setLast(localStorage.getItem(LAST_BACKUP)||""),[]);
 const due=!last||Date.now()-new Date(last).getTime()>=WEEK;
 function backup(){
  const data:Record<string,string>={};
  for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith("raghdemo-ledger-")&&k!==LAST_BACKUP)data[k]=localStorage.getItem(k)||"";}
  const now=new Date().toISOString();const payload={app:"Ledger",formatVersion:1,createdAt:now,data};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");
  a.href=url;a.download=`Ledger_Backup_${now.slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);
  localStorage.setItem(LAST_BACKUP,now);setLast(now);setMessage("Backup downloaded successfully.");
 }
 async function restore(e:ChangeEvent<HTMLInputElement>){
  const file=e.target.files?.[0];if(!file)return;
  try{
   const parsed=JSON.parse(await file.text());
   if(parsed?.app!=="Ledger"||parsed?.formatVersion!==1||!parsed?.data||typeof parsed.data!=="object")throw new Error("Invalid backup");
   const keys=Object.keys(parsed.data).filter(k=>k.startsWith("raghdemo-ledger-")&&k!==LAST_BACKUP);
   if(!keys.length)throw new Error("Empty backup");
   if(!window.confirm(`Restore ${keys.length} Ledger data sets from ${parsed.createdAt?.slice(0,10)||"this backup"}? Current matching data will be overwritten.`))return;
   keys.forEach(k=>localStorage.setItem(k,String(parsed.data[k])));
   setMessage("Restore completed. Reloading Ledger…");setTimeout(()=>window.location.reload(),700);
  }catch{setMessage("Restore failed: this is not a valid Ledger backup file.");}
  finally{e.target.value="";}
 }
 return <div style={shell}><Sidebar/><div style={{flex:1}}><Topbar/><main style={main}>
  <div style={head}><div><small style={eye}>CONFIGURATION</small><h1 style={h1}>Settings</h1><p style={muted}>Business preferences, backup and recovery.</p></div><button style={button}>Save Changes</button></div>
  <div style={notice}><b>Demo company:</b> RaghDemo Traders · Bengaluru, Karnataka · GST billing enabled</div>
  <section style={backupCard}><div><small style={eye}>BACKUP & RESTORE</small><h2 style={{margin:"5px 0 6px",fontSize:19}}>Protect your Ledger data</h2><p style={muted}>Download a complete local backup at least once every 7 days. Keep the file on another drive or secure storage.</p></div>
   <div style={backupStatus}><b style={{color:due?"#b42318":"#067647"}}>{due?"Weekly backup due":"Backup up to date"}</b><small style={small}>{last?`Last backup: ${new Date(last).toLocaleString()}`:"No backup has been created on this browser."}</small></div>
   <div style={actions}><button style={button} onClick={backup}>Download Backup</button><button style={secondary} onClick={()=>input.current?.click()}>Restore Backup</button><input ref={input} type="file" accept=".json,application/json" onChange={restore} hidden/></div>
   {message&&<div style={result}>{message}</div>}
  </section>
  <div style={grid}>{settings.map(s=><section key={s[0]} style={card}><div style={ico}>⚙</div><div style={{flex:1}}><h3 style={{margin:"0 0 5px",fontSize:15}}>{s[0]}</h3><b style={{fontSize:12}}>{s[1]}</b><p style={muted}>{s[2]}</p></div><button style={edit}>Edit</button></section>)}</div>
 </main></div></div>
}
const shell={display:"flex",minHeight:"100vh",background:"#f7f8fa"} as const,main={padding:30,maxWidth:1200,margin:"auto"} as const,head={display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20} as const,eye={color:"#be123c",fontWeight:800,letterSpacing:".12em"} as const,h1={margin:"4px 0",fontSize:27} as const,muted={margin:"4px 0 0",color:"#778294",fontSize:12} as const,small={display:"block",color:"#778294",fontSize:11,marginTop:5} as const,button={border:0,borderRadius:8,padding:"10px 15px",background:"#be123c",color:"#fff",fontWeight:700,cursor:"pointer"} as const,secondary={border:"1px solid #d7dbe2",borderRadius:8,padding:"9px 14px",background:"#fff",color:"#344054",fontWeight:700,cursor:"pointer"} as const,notice={background:"#fff7ed",border:"1px solid #fed7aa",color:"#9a3412",borderRadius:10,padding:13,marginBottom:15,fontSize:12} as const,backupCard={background:"#fff",border:"1px solid #e7e9ee",borderRadius:12,padding:18,marginBottom:15} as const,backupStatus={background:"#f8fafc",borderRadius:9,padding:12,marginTop:14} as const,actions={display:"flex",gap:9,marginTop:13} as const,result={marginTop:12,fontSize:12,fontWeight:700,color:"#344054"} as const,grid={display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:13} as const,card={background:"#fff",border:"1px solid #e7e9ee",borderRadius:12,padding:17,display:"flex",gap:12,alignItems:"flex-start"} as const,ico={width:34,height:34,borderRadius:9,background:"#f2f4f7",display:"grid",placeItems:"center"} as const,edit={border:"1px solid #d7dbe2",background:"#fff",borderRadius:7,padding:"6px 9px",fontSize:11,fontWeight:700} as const;
