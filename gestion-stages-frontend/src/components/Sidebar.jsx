import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Sidebar.css";

export default function Sidebar() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="sidebar">

      <img src={logo} width="80" alt="logo" />

      {/* ✅ USER INFO */}
      {user && (
        <div className="user-info">

          <h4>
            👋 مرحبا، {user?.name ? user.name.split("@")[0] : ""}
          </h4>

          {/* 🔥 POSTE */}
          <p style={{fontSize:"13px", opacity:0.8}}>
            {user?.poste || "—"}
          </p>

          {/* 🔥 ROLE */}
          <p className="user-role">
            🎓 {user?.role}
          </p>

        </div>
      )}

      <h2>لوحة التحكم</h2>

      <Link to="/">الرئيسية</Link>
      <Link to="/stagiaires">المتربصين</Link>
      <Link to="/entreprises">المؤسسات</Link>
      <Link to="/stages">التربصات</Link>
      <Link to="/rapports">التقارير</Link>
      <Link to="/users">المستخدمين</Link>
      <Link to="/frais">المصاريف</Link>
      <Link to="/statistiques">الإحصائيات</Link>

    </div>
  );
}