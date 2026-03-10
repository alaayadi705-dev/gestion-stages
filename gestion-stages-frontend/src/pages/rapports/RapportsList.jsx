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

  const [form,setForm]=useState({
    id:null,
    fichier:"",
    statut:"DEPOSE"
  });

  const [editing,setEditing]=useState(false);

  useEffect(()=>{
    load();
  },[]);

  const load=async()=>{

    try{

      const res=await getRapportsAPI();

      setData(res || []);

    }catch(e){

      console.error(e);

    }

  };

  const submit=async()=>{

    try{

      if(editing){

        await updateRapportAPI(form.id,form);

      }else{

        await addRapportAPI(form);

      }

      reset();

      load();

    }catch(e){

      console.error(e);

    }

  };

  const edit=(r)=>{

    setForm(r);

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
      statut:"DEPOSE"
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

          <input
            placeholder="اسم الملف"
            value={form.fichier}
            onChange={e=>setForm({
              ...form,
              fichier:e.target.value
            })}
          />

          <select
            value={form.statut}
            onChange={e=>setForm({
              ...form,
              statut:e.target.value
            })}
          >

            <option value="DEPOSE">
              DEPOSE
            </option>

            <option value="VALIDE">
              VALIDE
            </option>

            <option value="REJETE">
              REJETE
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
              <th>اسم الملف</th>
              <th>الحالة</th>
              <th>إجراءات</th>

            </tr>

          </thead>

          <tbody>

            {data.length===0 ? (

              <tr>
                <td colSpan="4">
                  لا توجد تقارير
                </td>
              </tr>

            ) : (

              data.map(r=>(

                <tr key={r.id}>

                  <td>{r.id}</td>

                  <td>{r.fichier}</td>

                  <td>{r.statut}</td>

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