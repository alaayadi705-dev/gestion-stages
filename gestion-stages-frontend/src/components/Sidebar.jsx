import React from "react";
import { Link } from "react-router-dom";

import logo from "../assets/logo.png";

import "./Sidebar.css";

export default function Sidebar() {

  return (

    <div className="sidebar">

      <img src={logo} width="80" alt="logo" />

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