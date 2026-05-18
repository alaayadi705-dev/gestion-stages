import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";
import logo from "../assets/logo-sidi-bouzid.png";
import { getStatistiquesAPI } from "../services/api";

export default function Dashboard(){

  const [stats,setStats]=useState({
    stagiaires:0,
    entreprises:0,
    rapports:0,
    stages:0
  });

  const [user,setUser]=useState({
    name:"admin",
    poste:"غير محدد",
    role:"USER"
  });

  useEffect(()=>{
    getStatistiquesAPI()
      .then(data=>{
        setStats({
          stagiaires: data?.totalStagiaires || 0,
          entreprises: data?.totalEntreprises || 0,
          rapports: data?.totalRapports || 0,
          stages: data?.totalStages || 0
        });
      })
      .catch(err => console.error("Error loading stats:", err));

    const poste = localStorage.getItem("poste");
    const email = localStorage.getItem("email");
    
    let currentRole = "USER";
    const storedUserStr = localStorage.getItem("user");
    if (storedUserStr) {
      try {
        const storedUserObj = JSON.parse(storedUserStr);
        if (storedUserObj && storedUserObj.role) {
          currentRole = storedUserObj.role;
        }
      } catch (err) {}
    }

    setUser({
      name: email || "admin",
      poste: poste || "غير محدد",
      role: currentRole
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
        <Link to="/rapports" className="stat-card blue">
          <div className="stat-icon">📄</div>
          <div className="stat-number">{stats.rapports}</div>
          <div className="stat-title">التقارير</div>
        </Link>

        {user.role !== "USER" && (
          <Link to="/entreprises" className="stat-card green">
            <div className="stat-icon">🏢</div>
            <div className="stat-number">{stats.entreprises}</div>
            <div className="stat-title">المؤسسات</div>
          </Link>
        )}

        <Link to="/stages" className="stat-card yellow">
          <div className="stat-icon">📅</div>
          <div className="stat-number">{stats.stages}</div>
          <div className="stat-title">التربصات</div>
        </Link>

        {user.role !== "USER" && (
          <Link to="/stagiaires" className="stat-card red">
            <div className="stat-icon">🎓</div>
            <div className="stat-number">{stats.stagiaires}</div>
            <div className="stat-title">المتربصين</div>
          </Link>
        )}
      </div>

    </div>
  );
}
