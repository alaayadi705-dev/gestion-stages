import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Sidebar.css";

export default function Sidebar() {

  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <img src={logo} width="80" alt="logo" />

      {/* USER INFO */}
      {user && (
        <div className="user-info">
          <h4>
            👋 مرحبا، {user?.email ? user.email.split("@")[0] : (user?.name ? user.name.split("@")[0] : "Admin")}
          </h4>
          <p style={{fontSize: "12px", opacity: 0.7, color: "#a5b4fc", marginTop: "-5px", direction: "ltr"}}>
            {user?.email || "admin@gmail.com"} 📧
          </p>
          <p style={{fontSize:"13px", opacity:0.8}}>
            {user?.poste || "—"}
          </p>
          <p className="user-role" style={{display: "flex", flexDirection: "column", gap: "4px"}}>
            <span>🏛️ {user?.ministere || "—"}</span>
            <span style={{opacity: 0.8, fontSize: "12px"}}>🎓 {user?.role}</span>
          </p>
        </div>
      )}

      <h2>لوحة التحكم</h2>

      {user?.role !== "USER" && (
        <Link to="/stagiaires" className={isActive("/stagiaires") ? "active" : ""}>المتربصين</Link>
      )}
      
      <Link to="/stages" className={isActive("/stages") ? "active" : ""}>التربصات</Link>
      {user?.role !== "USER" && (
        <Link to="/entreprises" className={isActive("/entreprises") ? "active" : ""}>المؤسسات</Link>
      )}
      <Link to="/rapports" className={isActive("/rapports") ? "active" : ""}>التقارير</Link>
      
      {user?.role === "USER" ? (
        <Link to="/profile" className={isActive("/profile") ? "active" : ""}>الملف الشخصي</Link>
      ) : (
        <>
          <Link to="/users" className={isActive("/users") ? "active" : ""}>المستخدمين</Link>
          {user?.role === "ADMIN" && <Link to="/ministeres" className={isActive("/ministeres") ? "active" : ""}>الوزارات</Link>}
          <Link to="/statistiques" className={isActive("/statistiques") ? "active" : ""}>الإحصائيات</Link>
        </>
      )}

      <button 
        onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
        style={{marginTop:"20px"}}
      >
        تسجيل الخروج
      </button>

    </div>
  );
}
