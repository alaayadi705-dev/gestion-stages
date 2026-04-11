import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";
import logo from "../assets/logo-sidi-bouzid.png";

export default function Dashboard(){

  const [stats,setStats]=useState({
    stagiaires:0,
    entreprises:0,
    rapports:0,
    frais:0
  });

  // 🔥 USER INFO
  const [user,setUser]=useState({
    name:"admin",
    poste:"غير محدد"
  });

  useEffect(()=>{

    // 📊 statistiques
    fetch("http://localhost:8080/api/statistiques")
      .then(res=>res.json())
      .then(data=>{
        setStats({
          stagiaires: data.totalStagiaires || 0,
          entreprises: data.totalEntreprises || 0,
          rapports: data.totalRapports || 0,
          frais: data.totalFrais || 0
        });
      });

    // 👤 user info (من localStorage)
    const poste = localStorage.getItem("poste");
    const email = localStorage.getItem("email");

    setUser({
      name: email || "admin",
      poste: poste || "غير محدد"
    });

  },[]);

  return(

    <div className="dashboard-container">

      {/* 🔥 HEADER USER */}
      <div style={{
        background:"#0f172a",
        color:"white",
        padding:"15px 20px",
        borderRadius:"10px",
        marginBottom:"20px",
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center"
      }}>

        <div>
          <h2 style={{margin:0}}>👋 مرحبا، {user.name}</h2>
          <p style={{margin:0,fontSize:"13px",opacity:"0.7"}}>
            المنصب: {user.poste}
          </p>
        </div>

      </div>

      <img src={logo} alt="logo" className="dashboard-logo"/>

      <div className="welcome-box">
        <h1>مرحبا بك في منظومة إدارة التربصات</h1>
        <p>اختر قسما من القائمة للبدء</p>
      </div>

      <div className="stats">

        <Link to="/frais" className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-number">{stats.frais}</div>
          <div className="stat-title">المصاريف</div>
        </Link>

        <Link to="/rapports" className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-number">{stats.rapports}</div>
          <div className="stat-title">التقارير</div>
        </Link>

        <Link to="/entreprises" className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-number">{stats.entreprises}</div>
          <div className="stat-title">المؤسسات</div>
        </Link>

        <Link to="/stagiaires" className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-number">{stats.stagiaires}</div>
          <div className="stat-title">المتربصين</div>
        </Link>

      </div>

    </div>

  );

}