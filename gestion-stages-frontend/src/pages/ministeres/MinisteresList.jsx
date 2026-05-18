import React, { useEffect, useState } from "react";
import {
  getMinisteresAPI,
  addMinistereAPI,
  updateMinistereAPI,
  deleteMinistereAPI
} from "../../services/api";

import { FaEdit, FaTrash } from "react-icons/fa";
import "../../styles/dashboard.css";

export default function MinisteresList(){

  const [data,setData]=useState([]);
  const [editing,setEditing]=useState(false);
  const [showAdd,setShowAdd]=useState(false);

  const [filters, setFilters] = useState({
    id: "",
    nom: ""
  });

  const [form,setForm]=useState({
    id:null,
    nom:""
  });

  useEffect(()=>{
    load();
  },[]);

  const load=async()=>{
    const res = await getMinisteresAPI();
    setData(Array.isArray(res) ? res : []);
  };

  const submit = async () => {
    if(!form.nom){
      alert("أدخل اسم الوزارة");
      return;
    }

    if(editing){
      await updateMinistereAPI(form.id, form);
    }else{
      await addMinistereAPI(form);
    }
    reset();
    load();
  };

  const edit = (m) => {
    setForm(m);
    setEditing(true);
    setShowAdd(true);
  };

  const remove = async (id) => {
    if(window.confirm("حذف هذه الوزارة؟ قد يؤثر ذلك على المؤسسات المرتبطة بها.")){
      await deleteMinistereAPI(id);
      load();
    }
  };

  const reset = () => {
    setForm({
      id:null,
      nom:""
    });
    setEditing(false);
    setShowAdd(false);
  };

  const filteredData = data.filter(item => {
    return (
      (filters.id === "" || String(item.id).includes(filters.id)) &&
      (filters.nom === "" || String(item.nom || "").toLowerCase().includes(filters.nom.toLowerCase()))
    );
  });

  return(
    <div className="main-content">

      <div className="header">
        <h1>إدارة الوزارات</h1>
      </div>

      <div className="card">

        <div style={headerStyle}>
          <span style={iconBox}>🏛️</span>
          <h2>قائمة الوزارات</h2>
        </div>

        <div style={filtersStyle}>
          <input placeholder="المعرف" onChange={(e)=>setFilters({...filters,id:e.target.value})}/>
          <input placeholder="اسم الوزارة" onChange={(e)=>setFilters({...filters,nom:e.target.value})}/>
        </div>

        <button style={addBtn} onClick={()=>setShowAdd(!showAdd)}>
          ➕ إضافة وزارة جديدة
        </button>

        {showAdd && (
          <div style={{marginBottom:"15px", display: "flex", gap: "10px", background: "rgba(30, 41, 59, 0.85)", padding: "15px", borderRadius: "12px"}}>
            <input placeholder="اسم الوزارة"
              value={form.nom}
              onChange={e=>setForm({...form,nom:e.target.value})}
              style={{flex: 1}}/>

            <button style={saveBtn} onClick={submit}>
              {editing ? "تعديل" : "إضافة"}
            </button>
            <button style={deleteBtn} onClick={reset}>إلغاء</button>
          </div>
        )}

        <div className="table-container">
          <table style={{width:"100%", borderCollapse:"collapse"}}>
            <thead style={{background:"linear-gradient(135deg, #312e81, #4338ca)", color:"white"}}>
              <tr>
                <th>المعرف</th>
                <th>اسم الوزارة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(m=>(
                <tr key={m.id} style={{textAlign:"center"}}>
                  <td>{m.id}</td>
                  <td>{m.nom}</td>
                  <td style={{display:"flex",justifyContent:"center",gap:"8px"}}>
                    <button style={editBtn} onClick={()=>edit(m)}>
                      <FaEdit/>
                    </button>
                    <button style={deleteBtn} onClick={()=>remove(m.id)}>
                      <FaTrash/>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && <tr><td colSpan="3" style={{padding:"20px"}}>لا توجد بيانات</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const headerStyle={display:"flex",alignItems:"center",gap:"10px",background:"linear-gradient(135deg, #312e81, #4338ca)",color:"white",padding:"10px",borderRadius:"12px",border:"1px solid rgba(99, 102, 241, 0.3)"};
const iconBox={background:"linear-gradient(135deg, #6366f1, #8b5cf6)",padding:"8px",borderRadius:"8px",boxShadow:"0 0 15px rgba(99, 102, 241, 0.5)"};
const filtersStyle={display:"flex",gap:"10px",margin:"10px 0"};
const addBtn={background:"linear-gradient(135deg, #22c55e, #16a34a)",color:"white",padding:"8px 15px",border:"none",borderRadius:"10px", cursor: "pointer",boxShadow:"0 4px 15px rgba(34, 197, 94, 0.3)",fontWeight:"600"};
const saveBtn={background:"linear-gradient(135deg, #6366f1, #8b5cf6)",color:"white",padding:"8px 15px",border:"none",borderRadius:"10px", cursor: "pointer",boxShadow:"0 4px 15px rgba(99, 102, 241, 0.3)",fontWeight:"600"};
const editBtn={background:"linear-gradient(135deg, #6366f1, #8b5cf6)",color:"white",border:"none",padding:"5px 10px",borderRadius:"8px",cursor:"pointer",boxShadow:"0 4px 12px rgba(99, 102, 241, 0.3)"};
const deleteBtn={background:"linear-gradient(135deg, #ef4444, #dc2626)",color:"white",border:"none",padding:"5px 10px",borderRadius:"8px",cursor:"pointer",boxShadow:"0 4px 12px rgba(239, 68, 68, 0.3)"};
