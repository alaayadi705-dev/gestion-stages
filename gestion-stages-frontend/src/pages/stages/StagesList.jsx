import React, { useEffect, useState } from "react";

import {
  getStagesAPI,
  addStageAPI,
  updateStageAPI,
  deleteStageAPI
} from "../../services/api";

import "../../styles/dashboard.css";

export default function StagesList(){

  const [data,setData]=useState([]);

  const [form,setForm]=useState({
    id:null,
    intitule:"",
    dateDebut:"",
    dateFin:"",
    pays:"",
    statut:"EN_COURS"
  });

  const [editing,setEditing]=useState(false);

  useEffect(()=>{
    load();
  },[]);

  const load=async()=>{

    const res=await getStagesAPI();

    const stagesAvecDuree=(res || []).map(stage=>{

      const debut=new Date(stage.dateDebut);
      const fin=new Date(stage.dateFin);

      const diff=Math.floor(
        (fin-debut)/(1000*60*60*24)
      );

      return{
        ...stage,
        duree:diff
      };

    });

    setData(stagesAvecDuree);

  };

  const submit=async()=>{

    if(editing){

      await updateStageAPI(form.id,form);

    }else{

      await addStageAPI(form);

    }

    reset();

    load();

  };

  const edit=(stage)=>{
    setForm(stage);
    setEditing(true);
  };

  const remove=async(id)=>{
    if(window.confirm("Supprimer ce stage ?")){
      await deleteStageAPI(id);
      load();
    }
  };

  const reset=()=>{
    setForm({
      id:null,
      intitule:"",
      dateDebut:"",
      dateFin:"",
      pays:"",
      statut:"EN_COURS"
    });
    setEditing(false);
  };

  return(

    <div className="content">

      <div className="header">
        <h1>إدارة التربصات</h1>
      </div>

      <div className="card">

        {/* FORM */}

        <div className="form-row">

          <input
            placeholder="عنوان التربص"
            value={form.intitule}
            onChange={e=>setForm({
              ...form,
              intitule:e.target.value
            })}
          />

          <input
            type="date"
            value={form.dateDebut}
            onChange={e=>setForm({
              ...form,
              dateDebut:e.target.value
            })}
          />

          <input
            type="date"
            value={form.dateFin}
            onChange={e=>setForm({
              ...form,
              dateFin:e.target.value
            })}
          />

          <input
            placeholder="البلد"
            value={form.pays}
            onChange={e=>setForm({
              ...form,
              pays:e.target.value
            })}
          />

          <select
            value={form.statut}
            onChange={e=>setForm({
              ...form,
              statut:e.target.value
            })}
          >

            <option value="EN_COURS">
              EN_COURS
            </option>

            <option value="TERMINE">
              TERMINE
            </option>

            <option value="ANNULE">
              ANNULE
            </option>

          </select>

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
              <th>عنوان التربص</th>
              <th>تاريخ البداية</th>
              <th>تاريخ النهاية</th>
              <th>المدة</th>
              <th>البلد</th>
              <th>الحالة</th>
              <th>إجراءات</th>

            </tr>

          </thead>

          <tbody>

            {data.map(stage=>(

              <tr key={stage.id}>

                <td>{stage.id}</td>

                <td>{stage.intitule}</td>

                <td>{stage.dateDebut}</td>

                <td>{stage.dateFin}</td>

                <td>
                  <b>{stage.duree} يوم</b>
                </td>

                <td>{stage.pays}</td>

                <td>{stage.statut}</td>

                <td>

                  <button
                    className="edit-btn"
                    onClick={()=>edit(stage)}
                  >
                    تعديل
                  </button>

                  <button
                    className="delete-btn"
                    onClick={()=>remove(stage.id)}
                  >
                    حذف
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}