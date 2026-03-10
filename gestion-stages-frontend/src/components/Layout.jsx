import React from "react";
import Sidebar from "./Sidebar";
import "../styles/main.css";

export default function Layout({ children }) {

  return (

    <div style={{ display: "flex", flexDirection: "row-reverse" }}>

      {/* Sidebar RIGHT */}
      <Sidebar />

      {/* Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        {children}
      </div>

    </div>

  );

}