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

  useEffect(()=>{

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

  },[]);

  return(

    <div className="dashboard-container">

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