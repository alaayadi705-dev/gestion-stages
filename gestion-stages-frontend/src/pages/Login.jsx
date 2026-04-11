import { jwtDecode } from "jwt-decode";
import "../styles/login.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../services/api";
import bg from "../assets/tunisia-bg.jpg";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await loginAPI(email, password);

      if (res && res.token) {

        // ✅ save token
        localStorage.setItem("token", res.token);

        // ✅ decode JWT
        const decoded = jwtDecode(res.token);

        // 🎯 SAFE extraction
        const userEmail = decoded?.sub || "";
        const userRole = decoded?.role || "";
        const userPoste = decoded?.poste || "—";

        // ✅ save user object
        localStorage.setItem("user", JSON.stringify({
          name: userEmail,
          role: userRole,
          poste: userPoste
        }));

        // 🔥 optional (quick access)
        localStorage.setItem("email", userEmail);
        localStorage.setItem("role", userRole);
        localStorage.setItem("poste", userPoste);

        // 🔁 redirect
        navigate("/dashboard");

      } else {
        alert("Email ou mot de passe incorrect");
      }

    } catch (error) {
      console.error(error);
      alert("Erreur serveur");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          padding: "40px",
          borderRadius: "10px",
          width: "350px",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#c62828", marginBottom: "20px" }}>
          تسجيل الدخول
        </h2>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />

          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#c62828",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            دخول
          </button>

        </form>

      </div>
    </div>
  );
}