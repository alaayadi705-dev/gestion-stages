import React, { useEffect, useState } from "react";
import {
  getStagiairesAPI,
  deleteStagiaireAPI,
  addStagiaireAPI,
  updateStagiaireAPI,
  getEntreprisesAPI,
  getStagesAPI,
  getUsersAPI
} from "../../services/api"; // Updated

import { FaEdit, FaTrash } from "react-icons/fa";
import "../../styles/dashboard.css";

export default function StagiairesList(){

  const [data,setData]=useState([]);
  const [entreprises,setEntreprises]=useState([]);
  const [stages,setStages]=useState([]);
  const [users,setUsers]=useState([]);

  const [editing,setEditing]=useState(false);
  const [showAdd,setShowAdd]=useState(false);
  const [selectedStagiaire, setSelectedStagiaire] = useState(null);

  const [filters, setFilters] = useState({
    id: "",
    nom: "",
    nationalite: "",
    specialite: "",
    statut: ""
  });

  const [form,setForm]=useState({
    id:null,
    nom:"",
    prenom:"",
    dateNaissance:"",
    nationalite:"",
    paysResidence:"",
    universite:"",
    specialite:"",
    email:"",
    telephone:"",
    grade:"",
    fonction:"",
    entrepriseId:"",
    stageId:"",
    utilisateurId:"",
    numeroPermission:""
  });

  const userRole = localStorage.getItem("role");

  useEffect(()=>{
    load();
    if (userRole !== "USER") {
      loadEntreprises();
      loadStages();
      loadUsers();
    }
  },[]);

  const load = async () => {
    const res = await getStagiairesAPI();
    setData(Array.isArray(res) ? res : []);
  };

  const loadEntreprises = async () => {
    const res = await getEntreprisesAPI();
    setEntreprises(res || []);
  };

  const loadStages = async () => {
    const res = await getStagesAPI();
    setStages(res || []);
  };

  const loadUsers = async () => {
    const res = await getUsersAPI();
    // On affiche les utilisateurs (souvent de rôle USER) pour les lier au profil stagiaire
    setUsers(res || []);
  };

  const submit = async () => {
    if (!form.nom || !form.prenom) {
      alert("أدخل الاسم واللقب");
      return;
    }

    const payload = {
      ...form,
      entreprise: form.entrepriseId ? { id: parseInt(form.entrepriseId) } : null,
      stage: form.stageId ? { id: parseInt(form.stageId) } : null,
      utilisateur: form.utilisateurId ? { id: parseInt(form.utilisateurId) } : null
    };

    delete payload.entrepriseId;
    delete payload.stageId;
    delete payload.utilisateurId;

    try {
      if (editing) {
        await updateStagiaireAPI(form.id, payload);
        alert("✅ تم التعديل بنجاح");
      } else {
        await addStagiaireAPI(payload);
        alert("✅ تم الإضافة بنجاح");
      }
      reset();
      load();
    } catch (err) {
      console.error("Submit error:", err);
      alert("❌ فشل في الحفظ: " + err.message);
    }
  };

  const edit = (s) => {
    setForm({
      ...s,
      entrepriseId: s.entreprise?.id || "",
      stageId: s.stage?.id || "",
      utilisateurId: s.utilisateur?.id || ""
    });
    setEditing(true);
    setShowAdd(true);
  };

  const remove = async (id) => {
    if(window.confirm("Supprimer ?")){
      await deleteStagiaireAPI(id);
      load();
    }
  };

  const reset = () => {
    setForm({
      id:null,
      nom:"",
      prenom:"",
      dateNaissance:"",
      nationalite:"",
      paysResidence:"",
      universite:"",
      specialite:"",
      email:"",
      telephone:"",
      grade:"",
      fonction:"",
      entrepriseId:"",
      stageId:"",
      utilisateurId: "",
      numeroPermission:""
    });
    setEditing(false);
    setShowAdd(false);
  };

  const filteredData = data.filter(item => {
    return (
      (filters.id === "" || String(item.id).includes(filters.id)) &&
      (filters.nom === "" || String(item.nom || "").toLowerCase().includes(filters.nom.toLowerCase()) || String(item.prenom || "").toLowerCase().includes(filters.nom.toLowerCase())) &&
      (filters.nationalite === "" || String(item.nationalite || "").toLowerCase().includes(filters.nationalite.toLowerCase())) &&
      (filters.specialite === "" || String(item.specialite || "").toLowerCase().includes(filters.specialite.toLowerCase())) &&
      (filters.statut === "" || String(item.statut || "").includes(filters.statut))
    );
  });

  return(
    <div className="main-content">

      <div className="header">
        <h1>{userRole === "USER" ? "ملفي الشخصي كمتربص" : "قائمة المتربصين"}</h1>
      </div>

      <div className="card">

        {/* HEADER */}
        <div style={headerStyle}>
          <span style={iconBox}>🔎</span>
          <h2>{userRole === "USER" ? "بيانات المتربص" : "بحث المتربصين"}</h2>
        </div>

        {/* FILTERS & ADD (Only for ADMIN/SUPERVISEUR) */}
        {userRole !== "USER" && (
          <>
            <div style={filtersStyle}>
              <input placeholder="المعرف" onChange={(e)=>setFilters({...filters,id:e.target.value})}/>
              <input placeholder="الاسم أو اللقب" onChange={(e)=>setFilters({...filters,nom:e.target.value})}/>
              <select onChange={(e)=>setFilters({...filters,statut:e.target.value})} style={{padding: "10px", borderRadius: "10px", border: "1px solid rgba(99, 102, 241, 0.3)"}}>
                <option value="">كل الحالات</option>
                <option value="EN_ATTENTE">في الانتظار (En attente)</option>
                <option value="CONFIRME">مؤكد (Confirmé)</option>
              </select>
            </div>

            <button style={addBtn} onClick={()=>setShowAdd(!showAdd)}>
              {showAdd ? "✖️ إغلاق" : "➕ إضافة متربص"}
            </button>
          </>
        )}

        {/* FORM */}
        {showAdd && userRole !== "USER" && (
          <div style={{marginBottom:"15px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", background: "rgba(30, 41, 59, 0.85)", padding: "15px", borderRadius: "12px", border: "1px solid rgba(99, 102, 241, 0.25)"}}>
            <input placeholder="الاسم" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} />
            <input placeholder="اللقب" value={form.prenom} onChange={e=>setForm({...form,prenom:e.target.value})} />
            <input type="date" value={form.dateNaissance} onChange={e=>setForm({...form,dateNaissance:e.target.value})} />
            <input placeholder="البريد الإلكتروني" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
            <input placeholder="الهاتف" value={form.telephone} onChange={e=>setForm({...form,telephone:e.target.value})} />
            <input placeholder="الرتبة" value={form.grade} onChange={e=>setForm({...form,grade:e.target.value})} />
            <input placeholder="الوظيفة" value={form.fonction} onChange={e=>setForm({...form,fonction:e.target.value})} />
            <input placeholder="رقم الإذن (Permission)" value={form.numeroPermission || ""} onChange={e=>setForm({...form,numeroPermission:e.target.value})} />

            <select value={form.entrepriseId} onChange={e=>setForm({...form,entrepriseId:e.target.value})}>
              <option value="">اختر المؤسسة</option>
              {entreprises.map(e=>(<option key={e.id} value={e.id}>{e.nom}</option>))}
            </select>

            <select value={form.stageId} onChange={e=>setForm({...form,stageId:e.target.value})}>
              <option value="">اختر التربص</option>
              {stages.map(s=>(<option key={s.id} value={s.id}>{s.intitule}</option>))}
            </select>

            <select value={form.utilisateurId} onChange={e=>setForm({...form,utilisateurId:e.target.value})}>
              <option value="">ربط بحساب مستخدم</option>
              {users.map(u=>(<option key={u.id} value={u.id}>{u.nom} {u.prenom} ({u.email})</option>))}
            </select>

            <div style={{gridColumn: "1 / -1", display: "flex", gap: "10px", marginTop: "10px"}}>
              <button style={saveBtn} onClick={submit}>
                {editing ? "تعديل" : "حفظ"}
              </button>
              <button style={deleteBtn} onClick={reset}>إلغاء</button>
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="table-container" style={{overflowX: "auto"}}>
          <table style={{width:"100%", minWidth: userRole === "USER" ? "100%" : "1500px", borderCollapse:"collapse"}}>
            <thead style={{background:"linear-gradient(135deg, #312e81, #4338ca)", color:"white", position:"sticky", top:0, zIndex: 1}}>
              <tr>
                <th>المعرف</th>
                <th>الاسم</th>
                <th>اللقب</th>
                <th>البريد الإلكتروني</th>
                <th>المؤسسة</th>
                <th>التربص</th>
                <th>الحالة</th>
                {userRole !== "USER" && <th>إجراءات</th>}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={userRole === "USER" ? "6" : "7"} style={{padding: "20px", color: "#64748b"}}>
                    لا توجد بيانات متاحة حالياً.
                  </td>
                </tr>
              ) : (
                filteredData.map((s) => (
                  <tr key={s.id} style={{textAlign: "center", cursor: "pointer", transition: "all 0.2s"}} onClick={() => setSelectedStagiaire(s)} onMouseOver={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"} onMouseOut={e => e.currentTarget.style.background="transparent"}>
                    <td>{s.id}</td>
                    <td>{s.nom}</td>
                    <td>{s.prenom}</td>
                    <td>{s.email || "-"}</td>
                    <td>
                      <span style={{padding: "4px 8px", background: "rgba(99, 102, 241, 0.2)", color: "#a5b4fc", borderRadius: "5px", fontSize: "12px"}}>
                        🏢 {s.entreprise?.nom || "-"}
                      </span>
                    </td>
                    <td>
                      <span style={{padding: "4px 8px", background: "rgba(139, 92, 246, 0.2)", color: "#c4b5fd", borderRadius: "5px", fontSize: "12px"}}>
                        📅 {s.stage?.intitule || "-"}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: "4px 8px", 
                        background: s.statut === "EN_ATTENTE" ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)", 
                        color: s.statut === "EN_ATTENTE" ? "#fca5a5" : "#4ade80", 
                        borderRadius: "12px", 
                        fontSize: "11px", 
                        fontWeight: "bold"
                      }}>
                        {s.statut === "EN_ATTENTE" ? "في الانتظار" : "مؤكد"}
                      </span>
                    </td>
                    {userRole !== "USER" && (
                      <td style={{display:"flex",justifyContent:"center",gap:"8px"}} onClick={e => e.stopPropagation()}>
                        {s.statut === "EN_ATTENTE" ? (
                          <>
                            <button style={{...editBtn, background:"#10b981", padding: "5px 12px"}} title="قبول" onClick={async (e) => {
                              e.stopPropagation();
                              if(window.confirm("قبول المتدرب؟")){
                                const payload = { ...s, statut: "CONFIRME" };
                                await updateStagiaireAPI(s.id, payload);
                                load();
                              }
                            }}>✔️ قبول</button>
                            <button style={{...deleteBtn, padding: "5px 12px"}} title="رفض" onClick={async (e) => {
                              e.stopPropagation();
                              if(window.confirm("رفض الطلب؟")){
                                const payload = { ...s, statut: "REFUSE" };
                                await updateStagiaireAPI(s.id, payload);
                                load();
                              }
                            }}>❌ رفض</button>
                          </>
                        ) : s.statut === "REFUSE" ? (
                          <span style={{color: "#ef4444", fontWeight: "bold", fontSize: "13px"}}>مرفوض</span>
                        ) : s.statut === "EN_ATTENTE_ARABIC" ? ( // Handling potential Arabic status if any
                           <span style={{color: "#64748b", fontWeight: "bold"}}>في الانتظار</span>
                        ) : (
                          <>
                            <button style={editBtn} onClick={(e) => { e.stopPropagation(); edit(s); }}>
                              <FaEdit/>
                            </button>
                            <button style={deleteBtn} onClick={(e) => { e.stopPropagation(); remove(s.id); }}>
                              <FaTrash/>
                            </button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* DETAILS MODAL */}
        {selectedStagiaire && (
          <div style={modalOverlayStyle} onClick={() => setSelectedStagiaire(null)}>
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
              <div style={modalHeaderStyle}>
                <h3>مسار المهمة / التربص</h3>
                <button style={closeBtnStyle} onClick={() => setSelectedStagiaire(null)}>✖</button>
              </div>

              {/* 3D STEPPER */}
              <div style={stepperContainerStyle}>
                {/* Step 1: Print */}
                <div style={stepStyle}>
                   <div style={stepIconStyle(selectedStagiaire.statut === "CONFIRME")}>🖨️</div>
                   <div style={stepLabelStyle}>طباعة</div>
                </div>
                <div style={stepLineStyle(selectedStagiaire.statut === "CONFIRME")}></div>
                {/* Step 2: Expenses */}
                <div style={stepStyle}>
                   <div style={stepIconStyle(true)}>💰</div>
                   <div style={stepLabelStyle}>المصاريف</div>
                </div>
                <div style={stepLineStyle(true)}></div>
                {/* Step 3: Destination */}
                <div style={stepStyle}>
                   <div style={stepIconStyle(true)}>📍</div>
                   <div style={stepLabelStyle}>الوجهة</div>
                </div>
                <div style={stepLineStyle(true)}></div>
                {/* Step 4: Beneficiaries */}
                <div style={stepStyle}>
                   <div style={stepIconStyle(true)}>👥</div>
                   <div style={stepLabelStyle}>المتفعون بالتربص</div>
                </div>
                <div style={stepLineStyle(true)}></div>
                {/* Step 5: Mission Data */}
                <div style={stepStyle}>
                   <div style={stepIconStyle(true)}>📄</div>
                   <div style={stepLabelStyle}>معطيات التربص</div>
                </div>
              </div>

              <div style={detailsContainerStyle}>
                 <div style={detailBoxStyle}>
                     <h4 style={{color: "#818cf8", marginBottom: "15px", fontSize: "18px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px"}}>الوجهة و المصاريف</h4>
                     <p style={{margin: "10px 0", fontSize: "16px"}}><strong>الوجهة :</strong> <span style={{color: "#c7d2fe"}}>{selectedStagiaire.stage?.pays || "غير متوفر"}</span></p>
                     <p style={{margin: "10px 0", fontSize: "16px"}}><strong>عدد الإذن :</strong> <span style={{color: "#4ade80"}}>{selectedStagiaire.numeroPermission || "غير متوفر"}</span></p>
                     <p style={{margin: "10px 0", fontSize: "16px"}}><strong>المنتفع بمأمورية :</strong> {selectedStagiaire.nom} {selectedStagiaire.prenom}</p>
                 </div>
              </div>

              <div style={modalFooterStyle}>
                 <button style={printBtnStyle} onClick={() => window.print()}>🖨️ طباعة إذن المهمة</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


// styles
const headerStyle={display:"flex",alignItems:"center",gap:"10px",background:"linear-gradient(135deg, #312e81, #4338ca)",color:"white",padding:"10px",borderRadius:"12px",border:"1px solid rgba(99, 102, 241, 0.3)"};
const iconBox={background:"linear-gradient(135deg, #6366f1, #8b5cf6)",padding:"8px",borderRadius:"8px",boxShadow:"0 0 15px rgba(99, 102, 241, 0.5)"};
const filtersStyle={display:"flex",gap:"10px",margin:"10px 0",flexWrap:"wrap"};
const addBtn={background:"linear-gradient(135deg, #22c55e, #16a34a)",color:"white",padding:"8px 15px",border:"none",borderRadius:"10px",cursor:"pointer",boxShadow:"0 4px 15px rgba(34, 197, 94, 0.3)",fontWeight:"600"};
const saveBtn={background:"linear-gradient(135deg, #6366f1, #8b5cf6)",color:"white",padding:"8px 15px",border:"none",borderRadius:"10px",cursor:"pointer",boxShadow:"0 4px 15px rgba(99, 102, 241, 0.3)",fontWeight:"600"};
const editBtn={background:"linear-gradient(135deg, #6366f1, #8b5cf6)",color:"white",border:"none",padding:"5px 10px",borderRadius:"8px",cursor:"pointer",boxShadow:"0 4px 12px rgba(99, 102, 241, 0.3)"};
const deleteBtn={background:"linear-gradient(135deg, #ef4444, #dc2626)",color:"white",border:"none",padding:"5px 10px",borderRadius:"8px",cursor:"pointer",boxShadow:"0 4px 12px rgba(239, 68, 68, 0.3)"};

// Modal Styles
const modalOverlayStyle = {position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, backdropFilter: "blur(8px)"};
const modalContentStyle = {background: "linear-gradient(145deg, #1e293b, #0f172a)", padding: "40px", borderRadius: "24px", width: "85%", maxWidth: "900px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)", border: "1px solid rgba(99, 102, 241, 0.3)", position: "relative", animation: "slideIn 0.3s ease-out"};
const modalHeaderStyle = {display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "15px", color: "white"};
const closeBtnStyle = {background: "transparent", border: "none", color: "#ef4444", fontSize: "24px", cursor: "pointer", transition: "transform 0.2s"};

// Stepper Styles
const stepperContainerStyle = {display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "50px", direction: "rtl", padding: "0 20px"}; 
const stepStyle = {display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, width: "100px"};
const stepIconStyle = (active) => ({width: "60px", height: "60px", borderRadius: "50%", background: active ? "linear-gradient(135deg, #10b981, #059669)" : "#334155", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "24px", color: "white", boxShadow: active ? "0 0 20px rgba(16, 185, 129, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "none", border: "2px solid rgba(255,255,255,0.1)", transition: "all 0.3s ease", textShadow: "0 2px 4px rgba(0,0,0,0.3)"});
const stepLabelStyle = {marginTop: "12px", color: "#e2e8f0", fontSize: "14px", fontWeight: "bold", textAlign: "center", textShadow: "0 1px 2px rgba(0,0,0,0.5)"};
const stepLineStyle = (active) => ({flex: 1, height: "4px", background: active ? "linear-gradient(to right, #10b981, #059669)" : "#334155", margin: "0 -20px", zIndex: 1, marginBottom: "30px", boxShadow: active ? "0 0 10px rgba(16, 185, 129, 0.5)" : "none", transition: "all 0.3s ease"});

// Details Styles
const detailsContainerStyle = {background: "rgba(255, 255, 255, 0.02)", padding: "25px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center", color: "#e2e8f0", backdropFilter: "blur(10px)"};
const detailBoxStyle = {display: "inline-block", textAlign: "right", background: "linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))", padding: "25px 40px", borderRadius: "16px", border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 10px 25px rgba(0,0,0,0.4)"};

const modalFooterStyle = {marginTop: "40px", display: "flex", justifyContent: "center"};
const printBtnStyle = {background: "linear-gradient(135deg, #4f46e5, #3b82f6)", color: "white", padding: "14px 30px", border: "none", borderRadius: "14px", fontSize: "18px", cursor: "pointer", boxShadow: "0 10px 20px rgba(59, 130, 246, 0.4), inset 0 2px 4px rgba(255,255,255,0.2)", fontWeight: "bold", transition: "all 0.2s ease"};