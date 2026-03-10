import React, { useEffect, useState } from "react";

import {
  getUsersAPI,
  addUserAPI,
  updateUserAPI,
  deleteUserAPI
} from "../../services/api";

import "../../styles/dashboard.css";

export default function UsersList(){

  const [data,setData]=useState([]);

  const [form,setForm]=useState({
    id:null,
    email:"",
    password:"",
    role:"USER"
  });

  const [editing,setEditing]=useState(false);

  useEffect(()=>{
    load();
  },[]);

  const load=async()=>{

    try{

      const res=await getUsersAPI();

      setData(res || []);

    }catch(e){

      console.error(e);

    }

  };

  const submit=async()=>{

    if(!form.email){
      alert("أدخل email");
      return;
    }

    try{

      if(editing){

        await updateUserAPI(form.id,form);

      }else{

        await addUserAPI(form);

      }

      reset();

      load();

    }catch(e){

      console.error(e);

    }

  };

  const edit=(user)=>{

    setForm({
      id:user.id,
      email:user.email,
      password:"",
      role:user.role
    });

    setEditing(true);

  };

  const remove=async(id)=>{

    if(window.confirm("Supprimer cet utilisateur ?")){

      await deleteUserAPI(id);

      load();

    }

  };

  const reset=()=>{

    setForm({
      id:null,
      email:"",
      password:"",
      role:"USER"
    });

    setEditing(false);

  };

  return(

    <div className="content">

      <div className="header">

        <h1>إدارة المستخدمين</h1>

      </div>

      <div className="card">

        {/* FORM */}

        <div className="form-row">

          <input
            placeholder="Email"
            value={form.email}
            onChange={e=>setForm({
              ...form,
              email:e.target.value
            })}
          />

          <input
            placeholder="Password"
            value={form.password}
            onChange={e=>setForm({
              ...form,
              password:e.target.value
            })}
          />

          <select
            value={form.role}
            onChange={e=>setForm({
              ...form,
              role:e.target.value
            })}
          >

            <option value="USER">
              USER
            </option>

            <option value="ADMIN">
              ADMIN
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
              <th>Email</th>
              <th>Role</th>
              <th>إجراءات</th>

            </tr>

          </thead>

          <tbody>

            {data.length===0 ? (

              <tr>
                <td colSpan="4">
                  لا يوجد مستخدمين
                </td>
              </tr>

            ) : (

              data.map(user=>(

                <tr key={user.id}>

                  <td>{user.id}</td>

                  <td>{user.email}</td>

                  <td>{user.role}</td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={()=>edit(user)}
                    >
                      تعديل
                    </button>

                    <button
                      className="delete-btn"
                      onClick={()=>remove(user.id)}
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