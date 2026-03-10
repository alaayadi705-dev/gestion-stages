import React,{useEffect,useState} from "react";
import {
  getEntreprisesAPI,
  deleteEntrepriseAPI,
  addEntrepriseAPI,
  updateEntrepriseAPI
} from "../../services/api";

import "../../styles/dashboard.css";

export default function EntreprisesList(){

  const [data,setData]=useState([]);

  const [form,setForm]=useState({
    id:null,
    nom:"",
    email:"",
    telephone:""
  });

  const [editing,setEditing]=useState(false);

  useEffect(()=>{load();},[]);

  const load=async()=>{
    setData(await getEntreprisesAPI());
  };

  const remove=async(id)=>{
    await deleteEntrepriseAPI(id);
    load();
  };

  const submit=async()=>{

    if(editing){

      await updateEntrepriseAPI(form.id,form);

    }else{

      await addEntrepriseAPI(form);

    }

    setForm({
      id:null,
      nom:"",
      email:"",
      telephone:""
    });

    setEditing(false);

    load();
  };

  const edit=(e)=>{
    setForm(e);
    setEditing(true);
  };

  return(

    <div className="content">

      <div className="header">
        <h1>المؤسسات</h1>
      </div>

      <div className="card">

        <div className="form-row">

          <input
            placeholder="اسم المؤسسة"
            value={form.nom}
            onChange={e=>setForm({...form,nom:e.target.value})}
          />

          <input
            placeholder="email"
            value={form.email}
            onChange={e=>setForm({...form,email:e.target.value})}
          />

          <input
            placeholder="الهاتف"
            value={form.telephone}
            onChange={e=>setForm({...form,telephone:e.target.value})}
          />

          <button className="add-btn" onClick={submit}>
            {editing?"تعديل":"إضافة"}
          </button>

        </div>

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>اسم المؤسسة</th>
              <th>Email</th>
              <th>الهاتف</th>
              <th>إجراءات</th>
            </tr>
          </thead>

          <tbody>

            {data.map(e=>(

              <tr key={e.id}>

                <td>{e.id}</td>
                <td>{e.nom}</td>
                <td>{e.email}</td>
                <td>{e.telephone}</td>

                <td>

                  <button
                    className="edit-btn"
                    onClick={()=>edit(e)}
                  >
                    تعديل
                  </button>

                  <button
                    className="delete-btn"
                    onClick={()=>remove(e.id)}
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