import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaBuilding, FaUserTie, FaIdCard, FaGlobe, FaCalendarAlt, FaMapMarkerAlt, FaUniversity, FaBriefcase, FaAward, FaCheckCircle } from "react-icons/fa";
import { updateUserAPI, getMinisteresAPI, getUsersAPI } from "../../services/api";
import "../../styles/dashboard.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [ministeres, setMinisteres] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    nom: "",
    prenom: "",
    ministere: "",
    cin: "",
    cnrpsCnss: "",
    nationalite: "",
    dateNaissance: "",
    lieuNaissance: "",
    rib: "",
    fonction: "",
    grade: "",
    etat: true
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      // Try to fetch fresh data from API first
      try {
        const userId = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        if (userId && token) {
          const res = await fetch(`http://localhost:8080/api/utilisateurs/${userId}`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          if (res.ok) {
            const apiUser = await res.json();
            setUser(apiUser);
            let minName = "";
            if (apiUser.ministere && typeof apiUser.ministere === 'object') {
              minName = apiUser.ministere.nom || "";
            } else {
              minName = apiUser.ministere || "";
            }
            setFormData({
              email: apiUser.email || "",
              nom: apiUser.nom || "",
              prenom: apiUser.prenom || "",
              ministere: minName,
              cin: apiUser.cin || "",
              cnrpsCnss: apiUser.cnrpsCnss || "",
              nationalite: apiUser.nationalite || "",
              dateNaissance: apiUser.dateNaissance || "",
              lieuNaissance: apiUser.lieuNaissance || "",
              rib: apiUser.rib || "",
              fonction: apiUser.fonction || "",
              grade: apiUser.grade || "",
              etat: apiUser.etat !== undefined ? apiUser.etat : true
            });
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn("API fetch failed, falling back to localStorage", e);
      }
      
      // Fallback to localStorage
      const storedUser = localStorage.getItem("user");
      const storedEmail = localStorage.getItem("email");
      const storedMin = localStorage.getItem("ministere");
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        let minName = "";
        if (parsedUser.ministere && typeof parsedUser.ministere === 'object') {
          minName = parsedUser.ministere.nom;
        } else {
          minName = parsedUser.ministere || storedMin || "";
        }

        setFormData({
          email: parsedUser.email || storedEmail || "",
          nom: parsedUser.nom || "",
          prenom: parsedUser.prenom || "",
          ministere: minName,
          cin: parsedUser.cin || "",
          cnrpsCnss: parsedUser.cnrpsCnss || "",
          nationalite: parsedUser.nationalite || "",
          dateNaissance: parsedUser.dateNaissance || "",
          lieuNaissance: parsedUser.lieuNaissance || "",
          rib: parsedUser.rib || "",
          fonction: parsedUser.fonction || "",
          grade: parsedUser.grade || "",
          etat: parsedUser.etat !== undefined ? parsedUser.etat : true
        });
      }
      setLoading(false);
    };

    loadProfile();
    getMinisteresAPI().then(res => {
      setMinisteres(Array.isArray(res) ? res : []);
    }).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...user,
        email: formData.email,
        nom: formData.nom,
        prenom: formData.prenom,
        cin: formData.cin,
        cnrpsCnss: formData.cnrpsCnss,
        nationalite: formData.nationalite,
        dateNaissance: formData.dateNaissance || null,
        lieuNaissance: formData.lieuNaissance,
        rib: formData.rib,
        fonction: formData.fonction,
        grade: formData.grade,
        etat: formData.etat,
        ministere: formData.ministere ? { nom: formData.ministere } : null
      };

      delete payload.password;

      await updateUserAPI(user.id, payload);
      
      const newUser = { ...payload };
      delete newUser.password;
      if (newUser.ministere && typeof newUser.ministere === 'object') {
        newUser.ministere = newUser.ministere.nom;
      }
      
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      
      setEditing(false);
      setMessage("\u2705 \u062a\u0645 \u062a\u062d\u062f\u064a\u062b \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a \u0628\u0646\u062c\u0627\u062d");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Update error:", err);
      setMessage("\u274c \u0641\u0634\u0644 \u0627\u0644\u062a\u062d\u062f\u064a\u062b");
    }
  };

  if (loading) return <div className="main-content"><h2 style={{color: "#c7d2fe"}}>جاري التحميل...</h2></div>;

  const roleLabel = user?.role === "ADMIN" ? "مدير" : user?.role === "SUPERVISEUR" ? "مشرف" : "مستخدم";

  return (
    <div className="main-content">
      <div className="header">
        <h1>الملف الشخصي</h1>
      </div>

      {/* Profile Header Card */}
      <div className="card" style={{ maxWidth: "900px", margin: "0 auto 25px", padding: "30px", display: "flex", alignItems: "center", gap: "25px" }}>
        <div style={{ 
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)", 
          width: "90px", 
          height: "90px", 
          borderRadius: "50%", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          fontSize: "44px",
          color: "white",
          boxShadow: "0 8px 25px rgba(99, 102, 241, 0.4), 0 0 40px rgba(99, 102, 241, 0.2)",
          flexShrink: 0
        }}>
          <FaUser />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: "22px" }}>
            {formData.nom && formData.prenom ? `${formData.nom} ${formData.prenom}` : user?.email}
          </h2>
          <p style={{ margin: "5px 0 0", color: "#cbd5e1", fontSize: "14px" }}>{user?.email}</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "8px", flexWrap: "wrap" }}>
            <span style={{ padding: "3px 12px", background: "rgba(99, 102, 241, 0.2)", color: "#a5b4fc", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
              {roleLabel}
            </span>
            {formData.etat && (
              <span style={{ padding: "3px 12px", background: "rgba(34, 197, 94, 0.2)", color: "#4ade80", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
                مفعل
              </span>
            )}
            {formData.ministere && (
              <span style={{ padding: "3px 12px", background: "rgba(139, 92, 246, 0.2)", color: "#c4b5fd", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
                {formData.ministere}
              </span>
            )}
          </div>
        </div>
      </div>

      {message && (
        <div style={{ 
          padding: "15px", 
          borderRadius: "12px", 
          background: message.includes("\u2705") ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
          color: message.includes("\u2705") ? "#4ade80" : "#fca5a5",
          marginBottom: "20px",
          textAlign: "center",
          maxWidth: "900px",
          margin: "0 auto 20px",
          border: message.includes("\u2705") ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)"
        }}>
          {message}
        </div>
      )}

      {/* Section 1: Account Info */}
      <div className="card" style={{ maxWidth: "900px", margin: "0 auto 25px", padding: "30px" }}>
        <div style={sectionHeaderStyle}>
          <div style={sectionIconStyle}>
            <FaEnvelope color="white" size={16} />
          </div>
          <h3 style={{ margin: 0, color: "#e0e7ff", fontSize: "16px" }}>بيانات الحساب / Compte</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <FieldGroup icon={<FaEnvelope color="#818cf8" />} label="البريد الإلكتروني">
            <input name="email" value={formData.email} onChange={handleChange} disabled={!editing} style={inputStyle} />
          </FieldGroup>
          <FieldGroup icon={<FaUserTie color="#818cf8" />} label="الدور">
            <input name="role" value={roleLabel} disabled={true} style={inputStyle} />
          </FieldGroup>
          <FieldGroup icon={<FaBuilding color="#818cf8" />} label="الوزارة">
            {editing ? (
              <select name="ministere" value={formData.ministere} onChange={handleChange} style={inputStyle}>
                <option value="">الوزارة</option>
                {ministeres.map((m, i) => (
                  <option key={m.id || i} value={m.nom}>{m.nom}</option>
                ))}
              </select>
            ) : (
              <input name="ministere" value={formData.ministere || "---"} disabled={true} style={inputStyle} />
            )}
          </FieldGroup>
          <FieldGroup icon={<FaCheckCircle color="#818cf8" />} label="الحالة">
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: editing ? "pointer" : "default", color: "#f1f5f9", fontSize: "14px", padding: "8px 0" }}>
              <input type="checkbox" name="etat" checked={formData.etat} onChange={handleChange} disabled={!editing} style={{ width: "18px", height: "18px", accentColor: "#6366f1" }} />
              مفعل / Actif
            </label>
          </FieldGroup>
        </div>
      </div>

      {/* Section 2: Personal Info */}
      <div className="card" style={{ maxWidth: "900px", margin: "0 auto 25px", padding: "30px" }}>
        <div style={sectionHeaderStyle}>
          <div style={sectionIconStyle}>
            <FaUser color="white" size={16} />
          </div>
          <h3 style={{ margin: 0, color: "#e0e7ff", fontSize: "16px" }}>البيانات الشخصية / Profil</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <FieldGroup icon={<FaIdCard color="#818cf8" />} label="بطاقة التعريف الوطنية / CIN">
            <input name="cin" value={formData.cin} onChange={handleChange} disabled={!editing} placeholder="CIN" style={inputStyle} />
          </FieldGroup>
          <FieldGroup icon={<FaUser color="#818cf8" />} label="اللقب / Nom">
            <input name="nom" value={formData.nom} onChange={handleChange} disabled={!editing} placeholder="اللقب" style={inputStyle} />
          </FieldGroup>
          <FieldGroup icon={<FaUser color="#818cf8" />} label="الاسم / Prénom">
            <input name="prenom" value={formData.prenom} onChange={handleChange} disabled={!editing} placeholder="الاسم" style={inputStyle} />
          </FieldGroup>
          <FieldGroup icon={<FaUniversity color="#818cf8" />} label="CNRPS أو CNSS">
            <input name="cnrpsCnss" value={formData.cnrpsCnss} onChange={handleChange} disabled={!editing} placeholder="CNRPS أو CNSS" style={inputStyle} />
          </FieldGroup>
          <FieldGroup icon={<FaGlobe color="#818cf8" />} label="الجنسية / Nationalité">
            <input name="nationalite" value={formData.nationalite} onChange={handleChange} disabled={!editing} placeholder="الجنسية" style={inputStyle} />
          </FieldGroup>
          <FieldGroup icon={<FaCalendarAlt color="#818cf8" />} label="تاريخ الولادة">
            <input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} disabled={!editing} style={inputStyle} />
          </FieldGroup>
          <FieldGroup icon={<FaMapMarkerAlt color="#818cf8" />} label="مكان الولادة / Lieu de naissance">
            <input name="lieuNaissance" value={formData.lieuNaissance} onChange={handleChange} disabled={!editing} placeholder="مكان الولادة" style={inputStyle} />
          </FieldGroup>
          <FieldGroup icon={<FaBuilding color="#818cf8" />} label="رقم الحساب البنكي / RIB">
            <input name="rib" value={formData.rib} onChange={handleChange} disabled={!editing} placeholder="RIB" style={inputStyle} />
          </FieldGroup>
        </div>
      </div>

      {/* Section 3: Professional Info */}
      <div className="card" style={{ maxWidth: "900px", margin: "0 auto 25px", padding: "30px" }}>
        <div style={sectionHeaderStyle}>
          <div style={sectionIconStyle}>
            <FaBriefcase color="white" size={16} />
          </div>
          <h3 style={{ margin: 0, color: "#e0e7ff", fontSize: "16px" }}>البيانات المهنية / Professionnel</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <FieldGroup icon={<FaBriefcase color="#818cf8" />} label="الخطة الوظيفية / Fonction">
            <input name="fonction" value={formData.fonction} onChange={handleChange} disabled={!editing} placeholder="الخطة الوظيفية" style={inputStyle} />
          </FieldGroup>
          <FieldGroup icon={<FaAward color="#818cf8" />} label="الرتبة / Grade">
            <input name="grade" value={formData.grade} onChange={handleChange} disabled={!editing} placeholder="الرتبة" style={inputStyle} />
          </FieldGroup>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        {!editing ? (
          <button 
            onClick={() => setEditing(true)}
            style={{ ...btnStyle, background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            تعديل الملف الشخصي
          </button>
        ) : (
          <>
            <button 
              onClick={() => setEditing(false)}
              style={{ ...btnStyle, background: "linear-gradient(135deg, #475569, #334155)" }}
            >
              إلغاء
            </button>
            <button 
              onClick={handleUpdate}
              style={{ ...btnStyle, background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
            >
              حفظ التغييرات
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function FieldGroup({ icon, label, children }) {
  return (
    <div className="profile-info-group">
      <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontWeight: "bold", color: "#c7d2fe", fontSize: "13px" }}>
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

const sectionHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px",
  borderBottom: "1px solid rgba(99, 102, 241, 0.2)",
  paddingBottom: "12px"
};

const sectionIconStyle = {
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  padding: "8px 12px",
  borderRadius: "8px",
  boxShadow: "0 0 15px rgba(99, 102, 241, 0.4)"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid rgba(99, 102, 241, 0.3)",
  background: "rgba(30, 41, 59, 0.8)",
  fontSize: "14px",
  outline: "none",
  color: "#f1f5f9",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
};

const btnStyle = {
  padding: "10px 25px",
  borderRadius: "12px",
  border: "none",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)"
};
