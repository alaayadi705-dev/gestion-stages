import React, { useEffect, useState } from "react";
import {
  getStagiairesAPI,
  deleteStagiaireAPI,
  addStagiaireAPI,
  updateStagiaireAPI,
  getEntreprisesAPI
} from "../../services/api";

import "../../styles/dashboard.css";

export default function StagiairesList(){

  const [data,setData]=useState([]);
  const [entreprises,setEntreprises]=useState([]);

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
    entrepriseId:""
  });

  const [editing,setEditing]=useState(false);

  useEffect(()=>{
    load();
    loadEntreprises();
  },[]);

  const load = async () => {
  const res = await getStagiairesAPI();
  setData(Array.isArray(res) ? res : []);
};

  const loadEntreprises=async()=>{
    const res=await getEntreprisesAPI();
    setEntreprises(res || []);
  };

  const remove=async(id)=>{
    if(window.confirm("Supprimer ?")){
      await deleteStagiaireAPI(id);
      load();
    }
  };

  const handleSubmit = async () => {

  const payload = {
    ...form,
    entreprise: form.entrepriseId
      ? { id: parseInt(form.entrepriseId) }
      : null
  };

  delete payload.entrepriseId;

  if (editing) {
    await updateStagiaireAPI(form.id, payload);
  } else {
    await addStagiaireAPI(payload);
  }

  setForm({
    id: null,
    nom: "",
    prenom: "",
    dateNaissance: "",
    nationalite: "",
    paysResidence: "",
    universite: "",
    specialite: "",
    email: "",
    telephone: "",
    grade: "",
    fonction: "",
    entrepriseId: ""
  });

  setEditing(false);
  load();
};

  const handleEdit=(s)=>{
    setForm({
      ...s,
      entrepriseId:s.entreprise?.id || ""
    });
    setEditing(true);
  };

  return(

    <div className="content">

      <div className="header">
        <h1>قائمة المتربصين</h1>
      </div>

      <div className="card">

        <div className="form-grid">

          <input placeholder="الاسم"
            value={form.nom}
            onChange={e=>setForm({...form,nom:e.target.value})}
          />

          <input placeholder="اللقب"
            value={form.prenom}
            onChange={e=>setForm({...form,prenom:e.target.value})}
          />

          <input type="date"
            value={form.dateNaissance}
            onChange={e=>setForm({...form,dateNaissance:e.target.value})}
          />

          <input placeholder="الجنسية"
            value={form.nationalite}
            onChange={e=>setForm({...form,nationalite:e.target.value})}
          />

          <input placeholder="بلد الإقامة"
            value={form.paysResidence}
            onChange={e=>setForm({...form,paysResidence:e.target.value})}
          />

          <input placeholder="الجامعة"
            value={form.universite}
            onChange={e=>setForm({...form,universite:e.target.value})}
          />

          <input placeholder="التخصص"
            value={form.specialite}
            onChange={e=>setForm({...form,specialite:e.target.value})}
          />

          <input placeholder="email"
            value={form.email}
            onChange={e=>setForm({...form,email:e.target.value})}
          />

          <input placeholder="الهاتف"
            value={form.telephone}
            onChange={e=>setForm({...form,telephone:e.target.value})}
          />

          <input placeholder="الرتبة"
            value={form.grade}
            onChange={e=>setForm({...form,grade:e.target.value})}
          />

          <input placeholder="الوظيفة"
            value={form.fonction}
            onChange={e=>setForm({...form,fonction:e.target.value})}
          />

          <select
            value={form.entrepriseId}
            onChange={e=>setForm({...form,entrepriseId:e.target.value})}
          >
            <option value="">اختر المؤسسة</option>
            {entreprises.map(e=>(
              <option key={e.id} value={e.id}>{e.nom}</option>
            ))}
          </select>

          <button className="add-btn" onClick={handleSubmit}>
            {editing ? "تعديل" : "إضافة"}
          </button>

        </div>

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>الاسم</th>
              <th>اللقب</th>
              <th>الجنسية</th>
              <th>بلد الإقامة</th>
              <th>الجامعة</th>
              <th>التخصص</th>
              <th>Email</th>
              <th>الهاتف</th>
              <th>المؤسسة</th>
              <th>الرتبة</th>
              <th>الوظيفة</th>
              <th>إجراءات</th>
            </tr>
          </thead>

          <tbody>
  {data.map((s) => (
    <tr key={s.id}>
      <td>{s.id}</td>
      <td>{s.nom}</td>
      <td>{s.prenom}</td>
      <td>{s.nationalite}</td>
      <td>{s.paysResidence}</td>
      <td>{s.universite}</td>
      <td>{s.specialite}</td>
      <td>{s.email}</td>
      <td>{s.telephone}</td>
      <td>{s.entreprise?.nom}</td>
      <td>{s.grade}</td>
      <td>{s.fonction}</td>
      <td>
        <button
          className="edit-btn"
          onClick={() => handleEdit(s)}
        >
          تعديل
        </button>

        <button
          className="delete-btn"
          onClick={() => remove(s.id)}
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