import Sidebar from "../../../components/layout/Sidebar";
import Topbar from "../../../components/layout/Topbar";
import SaleForm from "../../../components/forms/SaleForm";

export default function NewSale(){
  return <div style={{display:"flex",minHeight:"100vh",background:"#f7f8fa"}}>
    <Sidebar/>
    <div style={{flex:1,minWidth:0}}>
      <Topbar/>
      <main style={{padding:24,maxWidth:1300,margin:"0 auto"}}><SaleForm/></main>
    </div>
  </div>
}