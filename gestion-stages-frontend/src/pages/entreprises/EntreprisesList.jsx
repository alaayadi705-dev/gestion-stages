import React, { useEffect, useState } from "react";
import {
  getEntreprisesAPI,
  deleteEntrepriseAPI,
  addEntrepriseAPI,
  updateEntrepriseAPI,
  getMinisteresAPI
} from "../../services/api";

import { FaEdit, FaTrash } from "react-icons/fa";
import "../../styles/dashboard.css";

export default function EntreprisesList(){

  const [data,setData]=useState([]);
  const [ministeres, setMinisteres] = useState([]);
  const [editing,setEditing]=useState(false);
  const [showAdd,setShowAdd]=useState(false);

  const [filters, setFilters] = useState({
    id: "",
    nom: "",
    email: "",
    telephone: ""
  });

  const [form,setForm]=useState({
    id:null,
    nom:"",
    email:"",
    telephone:"",
    ministereId: ""
  });

  useEffect(()=>{
    load();
    loadMinisteres();
  },[]);

  const load=async()=>{
    const res = await getEntreprisesAPI();
    setData(res || []);
  };

  const loadMinisteres = async () => {
    const res = await getMinisteresAPI();
    setMinisteres(res || []);
  };

  const submit = async () => {
    if(!form.nom){
      alert("أدخل اسم المؤسسة");
      return;
    }

    const payload = {
      ...form,
      ministere: form.ministereId ? { id: parseInt(form.ministereId) } : null
    };
    delete payload.ministereId;

    if(editing){
      await updateEntrepriseAPI(form.id, payload);
    }else{
      await addEntrepriseAPI(payload);
    }
    reset();
    load();
  };

  const edit = (e) => {
    setForm({
      ...e,
      ministereId: e.ministere?.id || ""
    });
    setEditing(true);
    setShowAdd(true);
  };

  const remove = async (id) => {
    if(window.confirm("Supprimer ?")){
      await deleteEntrepriseAPI(id);
      load();
    }
  };

  const reset = () => {
    setForm({
      id:null,
      nom:"",
      email:"",
      telephone:"",
      ministereId: ""
    });
    setEditing(false);
    setShowAdd(false);
  };

  const filteredData = data.filter(item => {
    return (
      (filters.id === "" || String(item.id).includes(filters.id)) &&
      (filters.nom === "" || String(item.nom || "").toLowerCase().includes(filters.nom.toLowerCase())) &&
      (filters.email === "" || String(item.email || "").toLowerCase().includes(filters.email.toLowerCase())) &&
      (filters.telephone === "" || String(item.telephone || "").includes(filters.telephone))
    );
  });

  const userRole = localStorage.getItem("role");

  return(
    <div className="main-content">

      <div className="header">
        <h1>إدارة المؤسسات</h1>
      </div>

      <div className="card">

        {/* HEADER */}
        <div style={headerStyle}>
          <span style={iconBox}>🔎</span>
          <h2>بحث المؤسسات</h2>
        </div>

        {/* FILTERS */}
        <div style={filtersStyle}>
          <input placeholder="المعرف" onChange={(e)=>setFilters({...filters,id:e.target.value})}/>
          <input placeholder="اسم المؤسسة" onChange={(e)=>setFilters({...filters,nom:e.target.value})}/>
          <input placeholder="البريد الإلكتروني" onChange={(e)=>setFilters({...filters,email:e.target.value})}/>
          <input placeholder="الهاتف" onChange={(e)=>setFilters({...filters,telephone:e.target.value})}/>
        </div>

        {/* ADD BUTTON */}
        <button style={addBtn} onClick={()=>setShowAdd(!showAdd)}>
          {showAdd ? "✖️ إغلاق" : "➕ إضافة مؤسسة"}
        </button>

        {/* FORM */}
        {showAdd && (
          <div style={{marginBottom:"15px", display: "flex", gap: "10px", flexWrap: "wrap", background: "rgba(30, 41, 59, 0.85)", padding: "15px", borderRadius: "12px", border: "1px solid rgba(99, 102, 241, 0.25)"}}>
            <input placeholder="اسم المؤسسة"
              value={form.nom}
              onChange={e=>setForm({...form,nom:e.target.value})}/>

            <input placeholder="البريد الإلكتروني"
              value={form.email}
              onChange={e=>setForm({...form,email:e.target.value})}/>

            <input placeholder="الهاتف"
              value={form.telephone}
              onChange={e=>setForm({...form,telephone:e.target.value})}/>

            {userRole === "ADMIN" && (
              <select value={form.ministereId} onChange={e=>setForm({...form, ministereId: e.target.value})}>
                <option value="">اختر الوزارة</option>
                {ministeres.map(m => (
                  <option key={m.id} value={m.id}>{m.nom}</option>
                ))}
              </select>
            )}

            <button style={saveBtn} onClick={submit}>
              {editing ? "تعديل" : "حفظ"}
            </button>
            <button style={deleteBtn} onClick={reset}>إلغاء</button>
          </div>
        )}

        {/* TABLE */}
        <div className="table-container">

          <table style={{
            width:"100%",
            borderCollapse:"collapse"
          }}>

            <thead style={{
              background:"linear-gradient(135deg, #312e81, #4338ca)",
              color:"white",
              position:"sticky",
              top:0
            }}>
              <tr>
                <th>المعرف</th>
                <th>اسم المؤسسة</th>
                <th>الوزارة</th>
                <th>البريد الإلكتروني</th>
                <th>الهاتف</th>
                <th>إجراءات</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{padding: "20px", color: "#64748b"}}>
                    لا توجد مؤسسات متاحة حالياً.
                  </td>
                </tr>
              ) : (
                filteredData.map(e=>(
                  <tr key={e.id} style={{textAlign:"center"}}>
                    <td>{e.id}</td>
                    <td>{e.nom}</td>
                    <td>
                      <span style={{padding: "4px 8px", background: "rgba(99, 102, 241, 0.2)", color: "#a5b4fc", borderRadius: "5px", fontSize: "12px"}}>
                        🏛️ {e.ministere?.nom || "-"}
                      </span>
                    </td>
                    <td>{e.email || "-"}</td>
                    <td>{e.telephone || "-"}</td>

                    <td style={{display:"flex",justifyContent:"center",gap:"8px"}}>
                      <button style={editBtn} onClick={()=>edit(e)}>
                        <FaEdit/>
                      </button>

                      <button style={deleteBtn} onClick={()=>remove(e.id)}>
                        <FaTrash/>
                      </button>
                    </td>

                  </tr>
                ))
              )}
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