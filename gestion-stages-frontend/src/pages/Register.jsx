import { useState } from "react";
import "../styles/register.css";

function Register(){

  const [form,setForm]=useState({

    nom:"",
    prenom:"",
    email:"",
    password:"",
    role:"USER"

  });

  const change=(e)=>{

    setForm({

      ...form,
      [e.target.name]:e.target.value

    });

  };

  const submit=async(e)=>{

    e.preventDefault();

    await fetch("http://localhost:8080/api/auth/register",{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify(form)

    });

    alert("تم إنشاء الحساب");

    window.location.href="/login";

  };

  return(

    <div className="register-page">

      <form className="register-box" onSubmit={submit}>

        <h2>إنشاء حساب</h2>

        <input name="nom" placeholder="الاسم" onChange={change} required/>

        <input name="prenom" placeholder="اللقب" onChange={change} required/>

        <input name="email" type="email" placeholder="البريد الإلكتروني" onChange={change} required/>

        <input name="password" type="password" placeholder="كلمة المرور" onChange={change} required/>

        <select name="role" onChange={change}>

          <option value="USER">مستخدم</option>
          <option value="ADMIN">مدير</option>

        </select>

        <button type="submit">
          تسجيل
        </button>

      </form>

    </div>

  );

}

export default Register;