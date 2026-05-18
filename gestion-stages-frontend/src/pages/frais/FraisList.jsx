import React, { useEffect, useState } from "react";
import {
  getFraisAPI,
  addFraisAPI,
  updateFraisAPI,
  deleteFraisAPI,
  getStagesAPI
} from "../../services/api";

import { FaEdit, FaTrash } from "react-icons/fa";
import "../../styles/dashboard.css";

export default function FraisList() {

  const [data, setData] = useState([]);
  const [stages, setStages] = useState([]);
  const [editing, setEditing] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [filters, setFilters] = useState({
    id: "",
    type: "",
    devise: ""
  });

  const [form, setForm] = useState({
    id: null,
    stageId: "",
    type: "transport",
    montant: "",
    devise: "TND",
    support: ""
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const frais = await getFraisAPI();
      const stagesList = await getStagesAPI();
      setData(frais || []);
      setStages(stagesList || []);
    } catch (error) {
      console.error(error);
    }
  };

  const submit = async () => {
    try {
      const payload = {
        typeFrais: form.type, // matching entity property name if changed, wait actually the original code uses type. Let's see original api.js no, original code: type: form.type. Wait, entity is typeFrais. Let's keep original payload structure.
        type: form.type,
        montant: form.montant,
        devise: form.devise,
        support: form.support,
        stage: { id: form.stageId }
      };

      if (editing) {
        await updateFraisAPI(form.id, payload);
      } else {
        await addFraisAPI(payload);
      }

      reset();
      load();
    } catch (error) {
      console.error(error);
    }
  };

  const edit = (f) => {
    setForm({
      id: f.id,
      stageId: f.stage?.id || "",
      type: f.typeFrais || f.type,
      montant: f.montant,
      devise: f.devise,
      support: f.support
    });
    setEditing(true);
    setShowAdd(true);
  };

  const remove = async (id) => {
    if (window.confirm("Supprimer ce frais ?")) {
      await deleteFraisAPI(id);
      load();
    }
  };

  const reset = () => {
    setForm({
      id: null,
      stageId: "",
      type: "transport",
      montant: "",
      devise: "TND",
      support: ""
    });
    setEditing(false);
    setShowAdd(false);
  };

  const filteredData = data.filter(item => {
    return (
      (filters.id === "" || String(item.id).includes(filters.id)) &&
      (filters.type === "" || String(item.typeFrais || item.type || "").toLowerCase().includes(filters.type.toLowerCase())) &&
      (filters.devise === "" || String(item.devise || "").toLowerCase().includes(filters.devise.toLowerCase()))
    );
  });

  return (
    <div className="main-content">

      <div className="header">
        <h1>إدارة المصاريف</h1>
      </div>

      <div className="card">

        {/* HEADER */}
        <div style={headerStyle}>
          <span style={iconBox}>🔎</span>
          <h2>بحث المصاريف</h2>
        </div>

        {/* FILTERS */}
        <div style={filtersStyle}>
          <input placeholder="ID" onChange={(e)=>setFilters({...filters,id:e.target.value})}/>
          <select onChange={(e)=>setFilters({...filters,type:e.target.value})}>
            <option value="">كل الأنواع</option>
            <option value="transport">transport</option>
            <option value="hebergement">hebergement</option>
            <option value="timbre">timbre</option>
            <option value="autre">autre</option>
          </select>
          <input placeholder="العملة" onChange={(e)=>setFilters({...filters,devise:e.target.value})}/>
        </div>

        {/* ADD BUTTON */}
        <button style={addBtn} onClick={()=>setShowAdd(!showAdd)}>
          ➕ إضافة مصاريف
        </button>

        {/* FORM */}
        {showAdd && (
          <div style={{marginBottom:"15px", display: "flex", gap: "10px", flexWrap: "wrap"}}>
            <select
              value={form.stageId}
              onChange={(e) => setForm({ ...form, stageId: e.target.value })}
            >
              <option value="">اختر التربص</option>
              {stages.map((s) => (
                <option key={s.id} value={s.id}>{s.intitule}</option>
              ))}
            </select>

            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="transport">transport</option>
              <option value="hebergement">hebergement</option>
              <option value="timbre">timbre</option>
              <option value="autre">autre</option>
            </select>

            <input
              placeholder="montant (المبلغ)"
              value={form.montant}
              onChange={(e) => setForm({ ...form, montant: e.target.value })}
            />

            <input
              placeholder="devise (العملة)"
              value={form.devise}
              onChange={(e) => setForm({ ...form, devise: e.target.value })}
            />

            <input
              placeholder="support (الدعم)"
              value={form.support}
              onChange={(e) => setForm({ ...form, support: e.target.value })}
            />

            <button style={saveBtn} onClick={submit}>
              {editing ? "تعديل" : "إضافة"}
            </button>
            <button style={deleteBtn} onClick={reset}>إلغاء</button>
          </div>
        )}

        {/* TABLE */}
        <div className="table-container">
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead style={{background:"linear-gradient(135deg, #312e81, #4338ca)",color:"white",position:"sticky",top:0}}>
              <tr>
                <th>ID</th>
                <th>التربص</th>
                <th>النوع</th>
                <th>المبلغ</th>
                <th>العملة</th>
                <th>الدعم</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((f) => (
                <tr key={f.id} style={{textAlign:"center"}}>
                  <td>{f.id}</td>
                  <td>{f.stage?.intitule}</td>
                  <td>{f.typeFrais || f.type}</td>
                  <td>{f.montant}</td>
                  <td>{f.devise}</td>
                  <td>{f.support}</td>

                  <td style={{display:"flex",justifyContent:"center",gap:"8px"}}>
                    <button style={editBtn} onClick={() => edit(f)}>
                      <FaEdit/>
                    </button>
                    <button style={deleteBtn} onClick={() => remove(f.id)}>
                      <FaTrash/>
                    </button>
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