import React from "react";
import Sidebar from "./Sidebar";
import "../styles/main.css";

export default function Layout({ children }) {

  return (
    <div style={{ 
      display: "flex", 
      direction: "rtl", 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e293b 0%, #1e1b4b 25%, #1e293b 50%, #312e81 75%, #1e293b 100%)",
      position: "relative"
    }}>
      {/* Ambient glow effects */}
      <div style={{
        position: "fixed",
        top: "20%",
        left: "10%",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        pointerEvents: "none",
        zIndex: 0
      }} />
      <div style={{
        position: "fixed",
        bottom: "10%",
        right: "30%",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(80px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* Sidebar fixed width */}
      <div style={{ width: "260px", flexShrink: 0, position: "relative", zIndex: 1 }}>
        <Sidebar />
      </div>

      {/* Content takes remaining space */}
      <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1, paddingRight: "15px" }}>
        {children}
      </div>
    </div>
  );
}
