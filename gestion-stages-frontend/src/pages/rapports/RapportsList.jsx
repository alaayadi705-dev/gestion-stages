import React, { useEffect, useState } from "react";

import {
  getRapportsAPI,
  addRapportAPI,
  updateRapportAPI,
  deleteRapportAPI,
  getStagesAPI
} from "../../services/api";

import { FaEdit, FaTrash } from "react-icons/fa";
import "../../styles/dashboard.css";

export default function RapportsList(){

  const [data,setData]=useState([]);
  const [stages,setStages]=useState([]);
  const [editing,setEditing]=useState(false);
  const [showAdd,setShowAdd]=useState(false);

  const [filters, setFilters] = useState({
    id: "",
    fichier: "",
    statut: ""
  });

  const [form,setForm]=useState({
    id:null,
    fichier:"",
    statut:"DEPOSE",
    stageId:"",
    commentaires: "",
    dateValidation: ""
  });

  const userRole = localStorage.getItem("role");

  useEffect(()=>{
    load();
    loadStages();
  },[]);

  const load=async()=>{
    try{
      const res=await getRapportsAPI();
      setData(res || []);
    }catch(e){
      console.error(e);
    }
  };

  const loadStages = async () => {
    try {
      const res = await getStagesAPI();
      const list = res || [];
      setStages(list);
      // Auto-sélection si un seul stage disponible (pratique pour le USER)
      if (userRole === "USER" && list.length === 1 && !editing) {
        setForm(f => ({ ...f, stageId: list[0].id.toString() }));
      }
    } catch(e) {
      console.error(e);
    }
  };

  const submit = async () => {
    try {
      if (!form.fichier) {
        alert("يرجى إدخال اسم الملف");
        return;
      }
      if (!form.stageId) {
        alert("يرجى اختيار التربص أولاً. إذا لم تجد أي تربص، يرجى الاتصال بالمشرف.");
        return;
      }
      
      const payload = {
        ...form,
        stage: { id: parseInt(form.stageId) }
      };
      delete payload.stageId;

      console.log("Envoi du rapport:", payload);

      if (editing) {
        await updateRapportAPI(form.id, payload);
      } else {
        const response = await addRapportAPI(payload);
        console.log("Réponse ajout:", response);
      }

      reset();
      await load(); // Forcer le rechargement
      alert("تم حفظ التقرير بنجاح");
    } catch (e) {
      console.error("Erreur submit:", e);
      alert("حدث خطأ أثناء الحفظ: " + e.message);
    }
  };

  const edit=(r)=>{
    setForm({
      ...r,
      stageId: r.stage?.id || "",
      commentaires: r.commentaires || "",
      dateValidation: r.dateValidation || ""
    });
    setEditing(true);
    setShowAdd(true);
  };

  const remove=async(id)=>{
    if(window.confirm("Supprimer ce rapport ?")){
      await deleteRapportAPI(id);
      load();
    }
  };

  const reset=()=>{
    setForm({
      id:null,
      fichier:"",
      statut:"DEPOSE",
      stageId:"",
      commentaires: "",
      dateValidation: ""
    });
    setEditing(false);
    setShowAdd(false);
  };

  const filteredData = data.filter(item => {
    return (
      (filters.id === "" || String(item.id).includes(filters.id)) &&
      (filters.fichier === "" || String(item.fichier || "").toLowerCase().includes(filters.fichier.toLowerCase())) &&
      (filters.statut === "" || String(item.statut || "").toLowerCase().includes(filters.statut.toLowerCase()))
    );
  });

  return(
    <div className="main-content">

      <div className="header">
        <h1>إدارة التقارير</h1>
      </div>

      <div className="card">

        {/* HEADER */}
        <div style={headerStyle}>
          <span style={iconBox}>🔎</span>
          <h2>بحث التقارير</h2>
        </div>

        {/* FILTERS */}
        <div style={filtersStyle}>
          <input placeholder="المعرف" onChange={(e)=>setFilters({...filters,id:e.target.value})}/>
          <input placeholder="اسم الملف" onChange={(e)=>setFilters({...filters,fichier:e.target.value})}/>
          <select onChange={(e)=>setFilters({...filters,statut:e.target.value})}>
            <option value="">كل الحالات</option>
            <option value="DEPOSE">مودع (Déposé)</option>
            <option value="VALIDE">مقبول (Validé)</option>
            <option value="REJETE">مرفوض (Rejeté)</option>
          </select>
        </div>

        {/* ADD BUTTON */}
        <button style={addBtn} onClick={()=>setShowAdd(!showAdd)}>
          ➕ إضافة تقرير
        </button>

        {/* FORM */}
        {showAdd && (
          <div style={{marginBottom:"15px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", background: "rgba(30, 41, 59, 0.85)", padding: "15px", borderRadius: "12px"}}>
            <select
              value={form.stageId}
              onChange={e=>setForm({...form, stageId:e.target.value})}
            >
              <option value="">اختر التربص</option>
              {stages.map(s=>(<option key={s.id} value={s.id}>{s.intitule}</option>))}
            </select>

            <select
              value={form.statut}
              onChange={e=>setForm({...form, statut:e.target.value})}
            >
              <option value="DEPOSE">مودع (Déposé)</option>
              <option value="VALIDE">مقبول (Validé)</option>
              <option value="REJETE">مرفوض (Rejeté)</option>
            </select>

            <input
              placeholder="اسم الملف"
              value={form.fichier}
              onChange={e=>setForm({...form, fichier:e.target.value})}
            />

            <input
              type="date"
              title="تاريخ المصادقة"
              value={form.dateValidation}
              onChange={e=>setForm({...form, dateValidation:e.target.value})}
            />

            <textarea
              style={{gridColumn: "1 / -1", height: "80px", padding: "10px", borderRadius: "10px", border: "1px solid rgba(99, 102, 241, 0.3)"}}
              placeholder="ملاحظات المكون (Commentaires)"
              value={form.commentaires}
              onChange={e=>setForm({...form, commentaires:e.target.value})}
            />

            <div style={{gridColumn: "1 / -1", display: "flex", gap: "10px"}}>
              <button style={saveBtn} onClick={submit}>
                {editing ? "تعديل" : "حفظ"}
              </button>
              <button style={deleteBtn} onClick={reset}>إلغاء</button>
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="table-container">
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead style={{background:"linear-gradient(135deg, #312e81, #4338ca)",color:"white",position:"sticky",top:0}}>
              <tr>
                <th>المعرف</th>
                <th>اسم الملف</th>
                <th>الحالة</th>
                <th>الملاحظات</th>
                <th>التربص</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(r=>(
                <tr key={r.id} style={{textAlign:"center"}}>
                  <td>{r.id}</td>
                  <td><b>{r.fichier}</b></td>
                  <td>
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      background: r.statut === "VALIDE" ? "rgba(34, 197, 94, 0.2)" : r.statut === "REJETE" ? "rgba(239, 68, 68, 0.2)" : "rgba(234, 179, 8, 0.2)",
                      color: r.statut === "VALIDE" ? "#4ade80" : r.statut === "REJETE" ? "#fca5a5" : "#fbbf24"
                    }}>
                      {r.statut === "VALIDE" ? "مقبول" : r.statut === "REJETE" ? "مرفوض" : "مودع"}
                    </span>
                  </td>
                  <td><i style={{fontSize:"12px", color:"#94a3b8"}}>{r.commentaires || "---"}</i></td>
                  <td>{r.stage?.intitule || "-"}</td>
                  <td style={{display:"flex",justifyContent:"center",gap:"8px"}}>
                    <button style={editBtn} onClick={() => edit(r)}>
                      <FaEdit/>
                    </button>
                    {userRole !== "USER" && (
                      <button style={deleteBtn} onClick={() => remove(r.id)}>
                        <FaTrash/>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

// styles
const headerStyle={display:"flex",alignItems:"center",gap:"10px",background:"linear-gradient(135deg, #312e81, #4338ca)",color:"white",padding:"10px",borderRadius:"12px",border:"1px solid rgba(99, 102, 241, 0.3)"};
const iconBox={background:"linear-gradient(135deg, #6366f1, #8b5cf6)",padding:"8px",borderRadius:"8px",boxShadow:"0 0 15px rgba(99, 102, 241, 0.5)"};
const filtersStyle={display:"flex",gap:"10px",margin:"10px 0",flexWrap:"wrap"};
const addBtn={background:"linear-gradient(135deg, #22c55e, #16a34a)",color:"white",padding:"8px 15px",border:"none",borderRadius:"10px",boxShadow:"0 4px 15px rgba(34, 197, 94, 0.3)",fontWeight:"600"};
const saveBtn={background:"linear-gradient(135deg, #6366f1, #8b5cf6)",color:"white",padding:"8px 15px",border:"none",borderRadius:"10px",boxShadow:"0 4px 15px rgba(99, 102, 241, 0.3)",fontWeight:"600"};
const editBtn={background:"linear-gradient(135deg, #6366f1, #8b5cf6)",color:"white",border:"none",padding:"5px 10px",borderRadius:"8px",cursor:"pointer",boxShadow:"0 4px 12px rgba(99, 102, 241, 0.3)"};
const deleteBtn={background:"linear-gradient(135deg, #ef4444, #dc2626)",color:"white",border:"none",padding:"5px 10px",borderRadius:"8px",cursor:"pointer",boxShadow:"0 4px 12px rgba(239, 68, 68, 0.3)"};