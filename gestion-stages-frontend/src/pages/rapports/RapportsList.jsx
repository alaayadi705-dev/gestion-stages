import React, { useEffect, useState } from "react";

import {
  getRapportsAPI,
  addRapportAPI,
  updateRapportAPI,
  deleteRapportAPI
} from "../../services/api";

import "../../styles/dashboard.css";

export default function RapportsList(){

  const [data,setData]=useState([]);
  const [stages,setStages]=useState([]);

  const [form,setForm]=useState({
    id:null,
    fichier:"",
    statut:"DEPOSE",
    stageId:""
  });

  const [editing,setEditing]=useState(false);

  useEffect(()=>{
    load();
    loadStages(); // 🔥
  },[]);

  const load=async()=>{
    try{
      const res=await getRapportsAPI();
      setData(res || []);
    }catch(e){
      console.error(e);
    }
  };

  // 🔥 جلب stages
  const loadStages = async () => {
    const res = await fetch("http://localhost:8080/api/stages");
    const data = await res.json();
    setStages(data || []);
  };

  const submit=async()=>{
    try{

      const payload = {
        fichier: form.fichier,
        statut: form.statut,

        // 🔥 مهم
        stage: form.stageId
          ? { id: parseInt(form.stageId) }
          : null
      };

      if(editing){
        await updateRapportAPI(form.id,payload);
      }else{
        await addRapportAPI(payload);
      }

      reset();
      load();

    }catch(e){
      console.error(e);
    }
  };

  const edit=(r)=>{
    setForm({
      ...r,
      stageId: r.stage?.id || ""
    });
    setEditing(true);
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
      stageId:""
    });
    setEditing(false);
  };

  return(

    <div className="content">

      <div className="header">
        <h1>إدارة التقارير</h1>
      </div>

      <div className="card">

        {/* FORM */}
        <div className="form-row">

          {/* 🔥 SELECT STAGE */}
          <select
            value={form.stageId}
            onChange={e=>setForm({
              ...form,
              stageId:e.target.value
            })}
          >
            <option value="">اختر التربص</option>
            {stages.map(s=>(
              <option key={s.id} value={s.id}>
                {s.intitule}
              </option>
            ))}
          </select>

          <select
            value={form.statut}
            onChange={e=>setForm({
              ...form,
              statut:e.target.value
            })}
          >
            <option value="DEPOSE">DEPOSE</option>
            <option value="VALIDE">VALIDE</option>
            <option value="REJETE">REJETE</option>
          </select>

          <input
            placeholder="اسم الملف"
            value={form.fichier}
            onChange={e=>setForm({
              ...form,
              fichier:e.target.value
            })}
          />

          <button
            className="add-btn"
            onClick={submit}
          >
            {editing ? "تعديل" : "إضافة"}
          </button>

        </div>

        {/* TABLE */}

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>اسم الملف</th>
              <th>الحالة</th>
              <th>التربص</th> {/* 🔥 */}
              <th>إجراءات</th>
            </tr>
          </thead>

          <tbody>

            {data.length===0 ? (
              <tr>
                <td colSpan="5">لا توجد تقارير</td>
              </tr>
            ) : (
              data.map(r=>(
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.fichier}</td>
                  <td>{r.statut}</td>

                  {/* 🔥 عرض stage */}
                  <td>{r.stage?.intitule || "-"}</td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={()=>edit(r)}
                    >
                      تعديل
                    </button>

                    <button
                      className="delete-btn"
                      onClick={()=>remove(r.id)}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}