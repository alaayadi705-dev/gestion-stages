import { jwtDecode } from "jwt-decode";
import "../styles/login.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../services/api";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginFailed(false);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      const res = await loginAPI(trimmedEmail, trimmedPassword);

      if (res && res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("id", res.id);
        localStorage.setItem("email", res.email);
        localStorage.setItem("role", res.role);
        localStorage.setItem("poste", res.poste || "");
        localStorage.setItem("ministere", res.ministere || "");

        localStorage.setItem("user", JSON.stringify({
          id: res.id,
          cin: res.cin || "",
          nom: res.nom || "",
          prenom: res.prenom || "",
          cnrpsCnss: res.cnrpsCnss || "",
          nationalite: res.nationalite || "",
          dateNaissance: res.dateNaissance || "",
          lieuNaissance: res.lieuNaissance || "",
          rib: res.rib || "",
          fonction: res.fonction || "",
          grade: res.grade || "",
          niveauRetard: res.niveauRetard || "",
          categorie: res.categorie || "",
          groupe: res.groupe || "",
          email: res.email,
          role: res.role,
          poste: res.poste || "",
          etat: res.etat !== undefined ? res.etat : true,
          ministere: res.ministere || ""
        }));

        navigate("/dashboard");

      } else {
        setLoginFailed(true);
      }

    } catch (error) {
      setLoginFailed(true);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background orbs */}
      <div className="login-bg-orb login-bg-orb-1"></div>
      <div className="login-bg-orb login-bg-orb-2"></div>
      <div className="login-bg-orb login-bg-orb-3"></div>
      
      <div className="login-card">
        <div className="login-logo-wrapper">
          <div className="login-logo-circle">
            🔐
          </div>
        </div>
        
        <h2 className="login-title">
          تسجيل الدخول / Connexion
        </h2>
        
        <p className="login-subtitle">
          الجمهورية التونسية - منظومة إدارة التربصات
        </p>

        <form onSubmit={handleLogin}>

          {loginFailed && (
            <div className="login-error">
              <strong>❌ فشل تسجيل الدخول.</strong><br/>
              البريد الإلكتروني أو كلمة المرور غير صحيحة.
            </div>
          )}

          <div className="login-input-group">
            <span className="login-input-icon">📧</span>
            <input
              type="email"
              placeholder="البريد الإلكتروني / Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
          </div>

          <div className="login-input-group">
            <span className="login-input-icon">🔒</span>
            <input
              type="password"
              placeholder="كلمة المرور / Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </div>

          <button
            type="submit"
            className="login-btn"
          >
            دخول / Se connecter
          </button>

        </form>
      </div>
    </div>
  );
}
