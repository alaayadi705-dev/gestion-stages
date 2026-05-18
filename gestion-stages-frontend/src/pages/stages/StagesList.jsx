import React, { useEffect, useState } from "react";
import {
  getStagesAPI,
  addStageAPI,
  updateStageAPI,
  deleteStageAPI,
  getEntreprisesAPI,
  addFraisAPI,
  getStagiairesAPI,
  addStagiaireAPI,
  getAvailableStagesAPI,
  updateStagiaireAPI
} from "../../services/api";

import { FaEdit, FaTrash, FaMoneyBillWave, FaArrowLeft } from "react-icons/fa";
import "../../styles/dashboard.css";

export default function StagesList(){

  const [data, setData] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [stagiaireProfile, setStagiaireProfile] = useState([]);
  const [editing, setEditing] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [availableStages, setAvailableStages] = useState([]);

  const [filters, setFilters] = useState({
    id: "",
    intitule: "",
    pays: "",
    statut: ""
  });

  const [form, setForm] = useState({
    id: null,
    intitule: "",
    objectifs: "",
    typeStage: "Initiation",
    dateDebut: "",
    dateFin: "",
    pays: "",
    statut: "EN_COURS",
    entrepriseId: "",
    nom: "",
    prenom: "",
    email: "",
    budgetPropose: ""
  });

  const userRole = localStorage.getItem("role");

  useEffect(() => {
    load();
    loadEntreprises();
    if (userRole === "USER") {
      loadMyProfile();
      loadAvailableStages();
    }
  }, []);

  const loadAvailableStages = async () => {
    try {
      const res = await getAvailableStagesAPI();
      setAvailableStages(res || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadMyProfile = async () => {
    try {
      const res = await getStagiairesAPI();
      // Store ALL stagiaire records (not just first one)
      // so the USER can have multiple stage demands
      setStagiaireProfile(res && res.length > 0 ? res : []);
    } catch (e) {
      console.error(e);
    }
  };

  const load = async () => {
    try {
      const res = await getStagesAPI();
      const stagesAvecDuree = (res || []).map(stage => {
        const debut = new Date(stage.dateDebut);
        const fin = new Date(stage.dateFin);
        const diff = Math.floor((fin - debut) / (1000 * 60 * 60 * 24));
        
        const totalCost = (stage.frais || []).reduce((sum, f) => sum + (f.montant || 0), 0);
        
        return {
          ...stage,
          duree: diff || 0,
          totalCost: totalCost || 0
        };
      });
      setData(stagesAvecDuree);
    } catch(e) {
      console.error(e);
    }
  };

  const loadEntreprises = async () => {
    try {
      const res = await getEntreprisesAPI();
      setEntreprises(res || []);
    } catch(e) {
      console.error(e);
    }
  };

  const submit = async () => {
    if (userRole === "USER") {
      if (!form.intitule || !form.entrepriseId || !form.nom || !form.prenom) {
        alert("يرجى إكمال جميع الحانات (الاسم، اللقب، والتربص)");
        return;
      }

      try {
        // Always CREATE a new stagiaire record for each stage application
        // so that multiple demands are preserved
        const baseProfile = stagiaireProfile && stagiaireProfile.length > 0 ? stagiaireProfile[0] : {};
        const payload = {
          nom: form.nom,
          prenom: form.prenom,
          email: form.email || localStorage.getItem("email") || "",
          nationalite: baseProfile.nationalite || "",
          paysResidence: baseProfile.paysResidence || "",
          universite: baseProfile.universite || "",
          specialite: baseProfile.specialite || "",
          telephone: baseProfile.telephone || "",
          grade: baseProfile.grade || "",
          fonction: baseProfile.fonction || "",
          statut: "EN_ATTENTE",
          stage: { id: parseInt(form._selectedId) },
          entreprise: { id: parseInt(form.entrepriseId) },
          // The backend automatically assigns the Utilisateur based on the logged-in user
          utilisateur: null
        };

        await addStagiaireAPI(payload);
        alert("✅ تم إرسال طلب التربص بنجاح. يرجى انتظار موافقة المشرف.");
        reset();
        load();
        loadMyProfile();
      } catch (e) {
        console.error(e);
        alert("❌ فشل في تقديم الطلب: " + e.message);
      }
      return;
    }

    if (!form.intitule || !form.entrepriseId) {
      alert("أدخل عنوان التربص والمؤسسة");
      return;
    }

    const payload = {
      intitule: form.intitule,
      objectifs: form.objectifs,
      typeStage: form.typeStage,
      dateDebut: form.dateDebut,
      dateFin: form.dateFin,
      pays: form.pays,
      statut: form.statut,
      entreprise: { id: parseInt(form.entrepriseId) },
      budgetPropose: (form.budgetPropose !== "" && form.budgetPropose !== null) ? parseFloat(form.budgetPropose) : 0
    };

    try {
      if (editing) {
        await updateStageAPI(form.id, payload);
        alert("✅ تم تعديل التربص بنجاح");
      } else {
        await addStageAPI(payload);
        alert("✅ تم إضافة التربص بنجاح");
      }
      reset();
      load();
    } catch(e) {
      console.error(e);
      alert("❌ فشل في حفظ التغييرات: " + (e.response?.data?.message || e.message));
    }
  };

  const edit = (stage) => {
    setForm({
      ...stage,
      entrepriseId: stage.entreprise?.id || "",
      budgetPropose: stage.budgetPropose || ""
    });
    setEditing(true);
    setShowAdd(true);
  };

  const remove = async (id) => {
    if (window.confirm("Supprimer ce stage ?")) {
      await deleteStageAPI(id);
      load();
    }
  };

  const reset = () => {
    setEditing(false);
    setShowAdd(false);
    setForm({
      id: null,
      intitule: "",
      objectifs: "",
      typeStage: "Initiation",
      dateDebut: "",
      dateFin: "",
      pays: "",
      statut: "EN_COURS",
      entrepriseId: "",
      nom: "",
      prenom: "",
      email: "",
      budgetPropose: ""
    });
  };

  const filteredData = data.filter(item => {
    return (
      (filters.id === "" || String(item.id).includes(filters.id)) &&
      (filters.intitule === "" || String(item.intitule || "").toLowerCase().includes(filters.intitule.toLowerCase())) &&
      (filters.pays === "" || String(item.pays || "").toLowerCase().includes(filters.pays.toLowerCase())) &&
      (filters.statut === "" || String(item.statut || "").toLowerCase().includes(filters.statut.toLowerCase()))
    );
  });

  if(selectedStage) {
    return (
      <div className="main-content">
        <button className="add-btn" style={{background: "#64748b", display:"flex", alignItems:"center", gap:"8px"}} onClick={()=>setSelectedStage(null)}>
          <FaArrowLeft/> العودة لقائمة التربصات
        </button>
        <div className="card" style={{marginTop:"20px"}}>
          <h2 style={{color:"#c7d2fe", marginBottom:"15px"}}>🔍 تفاصيل التربص: {selectedStage.intitule}</h2>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:"30px", marginTop:"20px"}}>
            <div className="card" style={{background:"rgba(30, 41, 59, 0.85)", border:"1px solid rgba(99, 102, 241, 0.25)"}}>
              <h3 style={{display:"flex", alignItems:"center", gap:"10px", color:"#f87171"}}>💰 المصاريف والجانب المالي</h3>
              
              {/* Formulaire ajout rapide frais */}
              <div style={{display:"flex", flexDirection:"column", gap:"5px", marginBottom:"15px", background:"rgba(30, 41, 59, 0.85)", padding:"10px", borderRadius:"8px", border:"1px solid rgba(99, 102, 241, 0.25)"}}>
                <div style={{display:"flex", gap:"5px", width:"100%"}}>
                  <select style={{flex:1}} id="newFraisType">
                    <option value="Transport">Transport</option>
                    <option value="Timbre fiscal">Timbre fiscal</option>
                    <option value="Hébergement">Hébergement</option>
                    <option value="Autres">Autres</option>
                  </select>
                  <input style={{width:"100px"}} type="number" placeholder="المبلغ" id="newFraisMontant" />
                </div>
                <input placeholder="السند (Support)" id="newFraisSupport" style={{width:"100%"}} />
                <button style={{background:"#22c55e", color:"white", border:"none", borderRadius:"5px", padding:"5px 10px"}} onClick={async () => {
                  const type = document.getElementById("newFraisType").value;
                  const montant = document.getElementById("newFraisMontant").value;
                  const support = document.getElementById("newFraisSupport").value;
                  if(!type || !montant) return alert("الرجاء إدخال النوع والمبلغ");
                  
                  await addFraisAPI({
                    typeFrais: type,
                    montant: parseFloat(montant),
                    devise: "TND",
                    support: support,
                    stage: { id: selectedStage.id }
                  });
                  alert("تمت إضافة المصاريف");
                  document.getElementById("newFraisType").value = "Transport";
                  document.getElementById("newFraisMontant").value = "";
                  document.getElementById("newFraisSupport").value = "";
                  load();
                  setSelectedStage(null); 
                }}>➕</button>
              </div>

              <table style={{width:"100%", marginTop:"10px", fontSize:"13px"}}>
                <thead><tr style={{background:"rgba(99, 102, 241, 0.2)", color:"#c7d2fe"}}><th>النوع</th><th>المبلغ</th><th>العملة</th></tr></thead>
                <tbody>
                  {(selectedStage.frais || []).map(f => (
                    <tr key={f.id} style={{borderBottom:"1px solid rgba(51, 65, 85, 0.3)"}}><td>{f.typeFrais}</td><td>{f.montant}</td><td>{f.devise}</td></tr>
                  ))}
                  {(!selectedStage.frais || selectedStage.frais.length === 0) && <tr><td colSpan="3" style={{padding:"20px", color: "#94a3b8"}}>لا توجد مصاريف مسجلة</td></tr>}
                </tbody>
              </table>
              <div style={{marginTop:"15px", padding:"10px", background:"rgba(30, 41, 59, 0.85)", borderRadius:"8px", textAlign:"center", border:"1px dashed rgba(99, 102, 241, 0.5)"}}>
                <span style={{fontSize:"18px"}}>إجمالي التكلفة: </span>
                <b style={{fontSize:"22px", color:"#f87171"}}>{selectedStage.totalCost} TND</b>
              </div>
            </div>
            <div className="card" style={{background:"rgba(30, 41, 59, 0.85)", border:"1px solid rgba(99, 102, 241, 0.25)"}}>
              <h3 style={{display:"flex", alignItems:"center", gap:"10px", color:"#818cf8"}}>👥 المشاركون (المتربصين)</h3>
              <table style={{width:"100%", marginTop:"10px", fontSize:"13px"}}>
                <thead><tr style={{background:"rgba(99, 102, 241, 0.2)", color:"#c7d2fe"}}><th>الاسم واللقب</th><th>التخصص</th><th>الجامعة</th></tr></thead>
                <tbody>
                  {(selectedStage.stagiaires || []).map(s => (
                    <tr key={s.id} style={{borderBottom:"1px solid rgba(51, 65, 85, 0.3)"}}><td>{s.nom} {s.prenom}</td><td>{s.specialite}</td><td>{s.universite || "---"}</td></tr>
                  ))}
                  {(!selectedStage.stagiaires || selectedStage.stagiaires.length === 0) && <tr><td colSpan="3" style={{padding:"20px", color: "#94a3b8"}}>لا يوجد مشاركون مسجلون</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="header">
        <h1>إدارة التربصات</h1>
      </div>



      <div className="card">
        <div style={headerStyle}>
          <span style={iconBox}>🔎</span>
          <h2>البحث المتقدم</h2>
        </div>

        <div style={filtersStyle}>
          <input placeholder="المعرف" onChange={(e) => setFilters({...filters, id: e.target.value})} />
          <input placeholder="عنوان التربص" onChange={(e) => setFilters({...filters, intitule: e.target.value})} />
          <input placeholder="البلد" onChange={(e) => setFilters({...filters, pays: e.target.value})} />
          <select onChange={(e) => setFilters({...filters, statut: e.target.value})}>
            <option value="">كل الحالات</option>
            <option value="EN_ATTENTE">في الانتظار (En attente)</option>
            <option value="PREVU">مبرمج (Prévu)</option>
            <option value="EN_COURS">قيد الإنجاز (En cours)</option>
            <option value="CLOTURE">مغلق (Clôturé)</option>
          </select>
        </div>

        <button style={addBtn} onClick={() => setShowAdd(!showAdd)}>
          {userRole === "USER" ? "📝 تقديم طلب تربص" : "➕ إضافة تربص جديد"}
        </button>

        {showAdd && (
          <div style={{marginBottom: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "10px", background:"rgba(30, 41, 59, 0.85)", padding:"20px", borderRadius:"12px"}}>
            {userRole === "USER" && !editing ? (
              <div style={{gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", background:"rgba(30, 41, 59, 0.85)", padding:"15px", borderRadius:"10px", border: "1px solid rgba(99, 102, 241, 0.25)"}}>
                <div style={{gridColumn: "1 / -1"}}>
                  <p style={{margin: "0 0 10px 0", fontWeight: "bold", fontSize: "14px"}}>معلومات المتدرب:</p>
                </div>
                <input placeholder="الاسم" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} />
                <input placeholder="اللقب" value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} />
                <input placeholder="البريد الإلكتروني" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                
                <div style={{gridColumn: "1 / -1", marginTop: "10px"}}>
                  <p style={{margin: "0 0 10px 0", fontWeight: "bold", fontSize: "14px"}}>اختر التربص المطلوب:</p>
                  <select 
                    style={{width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px"}}
                    value={form._selectedId || ""}
                    onChange={e => {
                      const selectedStageId = e.target.value;
                      const selectedStage = availableStages.find(s => String(s.id) === selectedStageId);
                      if(selectedStage) {
                        setForm({
                          ...form,
                          intitule: selectedStage.intitule,
                          entrepriseId: selectedStage.entreprise?.id || "",
                          typeStage: selectedStage.typeStage || "Initiation",
                          dateDebut: selectedStage.dateDebut || "",
                          dateFin: selectedStage.dateFin || "",
                          pays: selectedStage.pays || "",
                          statut: "EN_ATTENTE",
                          _selectedId: selectedStageId,
                          nom: form.nom || (stagiaireProfile.length > 0 ? stagiaireProfile[0].nom : ""),
                          prenom: form.prenom || (stagiaireProfile.length > 0 ? stagiaireProfile[0].prenom : ""),
                          email: form.email || (stagiaireProfile.length > 0 ? stagiaireProfile[0].email : "")
                        });
                      } else {
                        reset();
                      }
                    }}
                  >
                    <option value="">-- يرجى اختيار تربص --</option>
                    {availableStages.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.intitule} {s.entreprise ? `(${s.entreprise.nom})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <>
                <input placeholder="عنوان التربص" value={form.intitule} onChange={e => setForm({...form, intitule: e.target.value})} />
                
                <div style={{gridColumn: "1 / -1", background: "rgba(30, 41, 59, 0.85)", padding: "10px", borderRadius: "10px", border: "1px solid rgba(99, 102, 241, 0.25)"}}>
                  <p style={{margin: "0 0 10px 0", fontWeight: "bold", fontSize: "14px"}}>المؤسسة الشريكة:</p>
                  <div style={{display: "flex", gap: "10px", flexWrap: "wrap", maxHeight: "150px", overflowY: "auto", padding: "5px"}}>
                    {entreprises.map(ent => (
                      <label key={ent.id} style={{
                        display: "flex", 
                        alignItems: "center", 
                        gap: "8px", 
                        padding: "8px 12px", 
                        background: form.entrepriseId == ent.id ? "rgba(34, 197, 94, 0.2)" : "rgba(30, 41, 59, 0.5)",
                        border: form.entrepriseId == ent.id ? "1px solid rgba(34, 197, 94, 0.5)" : "1px solid rgba(99, 102, 241, 0.25)",
                        borderRadius: "8px", 
                        cursor: "pointer",
                        transition: "0.2s"
                      }}>
                        <input 
                          type="radio" 
                          name="entreprise"
                          checked={form.entrepriseId == ent.id}
                          onChange={() => setForm({...form, entrepriseId: ent.id})}
                          style={{cursor: "pointer"}}
                        />
                        <span style={{fontSize: "13px"}}>{ent.nom}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <select value={form.typeStage} onChange={e => setForm({...form, typeStage: e.target.value})}>
                  <option value="Initiation">تربص ملاحظة (Initiation)</option>
                  <option value="Perfectionnement">تربص تحسيني (Perfectionnement)</option>
                  <option value="Formation">تربص تكوين (Formation)</option>
                </select>

                <input type="date" value={form.dateDebut} title="تاريخ البداية" onChange={e => setForm({...form, dateDebut: e.target.value})} />
                <input type="date" value={form.dateFin} title="تاريخ النهاية" onChange={e => setForm({...form, dateFin: e.target.value})} />
                <input placeholder="البلد" value={form.pays} onChange={e => setForm({...form, pays: e.target.value})} />
                <input type="number" placeholder="الميزانية المقترحة" value={form.budgetPropose} onChange={e => setForm({...form, budgetPropose: e.target.value})} />

                {userRole !== "USER" && (
                  <select value={form.statut} onChange={e => setForm({...form, statut: e.target.value})}>
                    <option value="EN_ATTENTE">في الانتظار</option>
                    <option value="PREVU">مبرمج</option>
                    <option value="EN_COURS">قيد الإنجاز</option>
                    <option value="CLOTURE">مغلق</option>
                  </select>
                )}
              </>
            )}

            <div style={{gridColumn: "1 / -1", display: "flex", gap: "10px", marginTop:"10px"}}>
              <button style={saveBtn} onClick={submit}>{editing ? "حفظ التعديلات" : (userRole === "USER" ? "تقديم الطلب" : "إضافة التربص")}</button>
              <button style={deleteBtn} onClick={reset}>إلغاء</button>
            </div>
          </div>
        )}

        <div className="table-container">
          <table style={{width: "100%", borderCollapse: "collapse", minWidth: "1100px"}}>
            <thead style={{background: "linear-gradient(135deg, #312e81, #4338ca)", color: "white", position: "sticky", top: 0}}>
              <tr>
                <th>المعرف</th>
                <th>العنوان</th>
                <th>المؤسسة</th>
                <th>البلد</th>
                <th>المدة</th>
                <th>الميزانية المقترحة</th>
                <th>التكلفة الإجمالية</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(stage => (
                <tr key={stage.id} style={{textAlign: "center", borderBottom:"1px solid #ddd"}}>
                  <td>{stage.id}</td>
                  <td>
                    {stage.intitule}
                    <div style={{display: "flex", gap: "5px", justifyContent: "center", marginTop: "5px"}}>
                      <span style={{padding: "2px 8px", background: "rgba(99, 102, 241, 0.2)", color: "#a5b4fc", borderRadius: "12px", fontSize: "10px", fontWeight: "bold"}}>
                        {stage.typeStage === "Initiation" ? "تربص ملاحظة" : stage.typeStage === "Perfectionnement" ? "تربص تحسيني" : "تربص تكوين"}
                      </span>
                      <span style={{
                        padding: "2px 8px", 
                        background: stage.statut === "EN_ATTENTE" ? "rgba(239, 68, 68, 0.2)" : stage.statut === "PREVU" ? "rgba(100, 116, 139, 0.2)" : stage.statut === "EN_COURS" ? "rgba(234, 179, 8, 0.2)" : "rgba(34, 197, 94, 0.2)", 
                        color: stage.statut === "EN_ATTENTE" ? "#fca5a5" : stage.statut === "PREVU" ? "#94a3b8" : stage.statut === "EN_COURS" ? "#fbbf24" : "#4ade80", 
                        borderRadius: "12px", 
                        fontSize: "10px", 
                        fontWeight: "bold"
                      }}>
                        {stage.statut === "PREVU" ? "مبرمج" : stage.statut === "EN_COURS" ? "قيد الإنجاز" : stage.statut === "EN_ATTENTE" ? "في الانتظار" : "مغلق"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      padding: "6px 12px",
                      background: "rgba(30, 41, 59, 0.8)",
                      color: "#94a3b8",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: "500",
                      border: "1px solid rgba(99, 102, 241, 0.25)"
                    }}>
                      🏢 {stage.entreprise?.nom || "---"}
                    </span>
                  </td>
                  <td>{stage.pays}</td>
                  <td><b>{stage.duree} يوم</b></td>
                  <td style={{color: "#4ade80", fontWeight:"bold"}}>{stage.budgetPropose || 0} TND</td>
                  <td style={{color: "#f87171", fontWeight:"bold"}}>{stage.totalCost} TND</td>

                  <td style={{display: "flex", justifyContent: "center", gap: "8px", padding:"10px"}}>
                    {userRole === "USER" && stagiaireProfile.some(sp => sp.stage?.id === stage.id) ? (
                       <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                          {stagiaireProfile.find(sp => sp.stage?.id === stage.id)?.statut === "EN_ATTENTE" ? (
                             <span style={{color: "#fbbf24", fontWeight: "bold", fontSize: "13px", background: "rgba(234, 179, 8, 0.2)", padding: "5px 10px", borderRadius: "8px"}}>في الانتظار</span>
                          ) : stagiaireProfile.find(sp => sp.stage?.id === stage.id)?.statut === "REFUSE" ? (
                             <span style={{color: "#fca5a5", fontWeight: "bold", fontSize: "13px", background: "rgba(239, 68, 68, 0.2)", padding: "5px 10px", borderRadius: "8px"}}>مرفوض</span>
                          ) : (
                            <button style={{...editBtn, background:"#22c55e", padding:"8px 12px"}} title="المصاريف والمشاركون" onClick={() => setSelectedStage(stage)}>
                              <FaMoneyBillWave/> التفاصيل
                            </button>
                          )}
                       </div>
                    ) : (
                      <>
                        <button style={{...editBtn, background:"#22c55e", padding:"8px 12px"}} title="المصاريف والمشاركون" onClick={() => setSelectedStage(stage)}>
                          <FaMoneyBillWave/> التفاصيل
                        </button>
                        {userRole !== "USER" && (
                          <>
                            <button style={editBtn} onClick={() => edit(stage)}>
                              <FaEdit/>
                            </button>
                            <button style={deleteBtn} onClick={() => remove(stage.id)}>
                              <FaTrash/>
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Helper message for USER */}
        {userRole === "USER" && (
          <p style={{fontSize: "12px", color: "#94a3b8", marginTop: "10px", textAlign: "center"}}>
            💡 كمتدرب، يمكنك عرض تفاصيل تربصاتك فقط. لإجراء تعديلات، يرجى الاتصال بالمشرف.
          </p>
        )}
      </div>
    </div>
  );
}

const userRole = localStorage.getItem("role");

const headerStyle={display:"flex",alignItems:"center",gap:"10px",background:"linear-gradient(135deg, #312e81, #4338ca)",color:"white",padding:"10px",borderRadius:"12px",border:"1px solid rgba(99, 102, 241, 0.3)"};
const iconBox={background:"linear-gradient(135deg, #6366f1, #8b5cf6)",padding:"8px",borderRadius:"8px",boxShadow:"0 0 15px rgba(99, 102, 241, 0.4)"};
const filtersStyle={display:"flex",gap:"10px",margin:"10px 0",flexWrap:"wrap"};
const addBtn={background:"linear-gradient(135deg, #22c55e, #16a34a)",color:"white",padding:"8px 15px",border:"none",borderRadius:"10px", cursor:"pointer",boxShadow:"0 4px 15px rgba(34, 197, 94, 0.3)",fontWeight:"600"};
const saveBtn={background:"linear-gradient(135deg, #6366f1, #8b5cf6)",color:"white",padding:"8px 15px",border:"none",borderRadius:"10px", cursor:"pointer",boxShadow:"0 4px 15px rgba(99, 102, 241, 0.3)",fontWeight:"600"};
const editBtn={background:"linear-gradient(135deg, #6366f1, #8b5cf6)",color:"white",border:"none",padding:"5px 10px",borderRadius:"8px",cursor:"pointer",boxShadow:"0 4px 12px rgba(99, 102, 241, 0.3)"};
const deleteBtn={background:"linear-gradient(135deg, #ef4444, #dc2626)",color:"white",border:"none",padding:"5px 10px",borderRadius:"8px",cursor:"pointer",boxShadow:"0 4px 12px rgba(239, 68, 68, 0.3)"};
