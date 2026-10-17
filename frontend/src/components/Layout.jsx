import { useState } from "react";
import {styles} from "../assets/dummyStyles";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
const Layout = ({onlogout, user}) => {
  const [sidebarCollepsed, setSidebarCollapsed] = useState (false);
  return (
    <div className={styles.layout.root}>
      <Navbar user={user} onlogout={onlogout}/>
      <Sidebar user={user} isCollapsed={sidebarCollepsed} 
      sidebarCollepsed ={setSidebarCollapsed} />

     
    </div>
    
  )
}

export default Layout