import React, { useRef } from 'react'
import { sidebarStyles, cn } from '../assets/dummyStyles;s';
import {motion} from 'framer-motion' ;
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const MENU_ITEMS = [
  { text: "Dashboard", path: "/", icon: <Home size={20} /> },
  { text: "Income", path: "/income", icon: <ArrowUp size={20} /> },
  { text: "Expenses", path: "/expense", icon: <ArrowDown size={20} /> },
  { text: "Profile", path: "/profile", icon: <User size={20} /> },
];

const Sidebar = (user ,isCollapsed , setisCollapsed) => {
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const sidebarRef = useRef(null);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeHover, setActiveHover] = useState(null);

    const {name: username = "User" , email = "user@example.com"} = user || {};
    const initial = username.charAt(0).toUpperCase();

    // to check for overFlow in mobile
      useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto" };
  }, [mobileOpen]);

  // click outside 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);


  // to logout 
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleSidebar = () => setisCollapsed((c) => !c);
  return (
    <>
    <motion.div>

    </motion.div>
    </>
  )
}

export default Sidebar;