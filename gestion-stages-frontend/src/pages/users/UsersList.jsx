import { useEffect, useState } from "react";
import {
  getUsersAPI,
  addUserAPI,
  updateUserAPI,
  deleteUserAPI
} from "../../services/api";

import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import "../../styles/dashboard.css";

export default function UsersList(){

  const [data,setData]=useState([]);
  const [editing,setEditing]=useState(false);
  const [showAdd,setShowAdd]=useState(false);

  const [filters, setFilters] = useState({
    id: "",
    email: "",
    ministere: "",
    poste: "",
    role: ""
  });

  const [showPassword,setShowPassword]=useState({});

  const togglePassword=(id)=>{
    setShowPassword(prev=>({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const ministeres = [
    "وزارة الشؤون الخارجية","وزارة الشؤون المحلية","وزارة الشؤون الدينية",
    "وزارة الشؤون الاجتماعية","وزارة الفلاحة","وزارة التجارة",
    "وزارة الثقافة","وزارة الدفاع","وزارة الاقتصاد والتخطيط",
    "وزارة التربية","وزارة الطاقة","وزارة التعليم العالي",
    "وزارة البيئة","وزارة التجهيز","وزارة المرأة والأسرة",
    "وزارة المالية","وزارة الوظيفة العمومية","وزارة التكوين المهني",
    "وزارة الصناعة","وزارة الداخلية","وزارة الاستثمار",
    "وزارة الشباب والرياضة","وزارة العدل","وزارة الصحة",
    "وزارة تكنولوجيا الاتصال","وزارة السياحة","وزارة النقل"
  ];

  const [form,setForm]=useState({
    id:null,
    email:"",
    password:"",
    role:"USER",
    ministere:"",
    poste:""
  });

  useEffect(()=>{
    const fetchData = async () => {
      const res = await getUsersAPI(filters);
      setData(res || []);
    };
    fetchData();
  },[filters]);

  const submit = async () => {
    if(!form.email){
      alert("أدخل email");
      return;
    }

    if(!editing && !form.password){
      alert("أدخل password");
      return;
    }

    if(editing){
      await updateUserAPI(form.id, form);
    }else{
      await addUserAPI(form);
    }

    reset();
  };

  const edit = (user) => {
    setForm({
      id:user.id,
      email:user.email,
      password:user.password || "",
      role:user.role,
      ministere:user.ministere || "",
      poste:user.poste || ""
    });
    setEditing(true);
    setShowAdd(true);
  };

  const remove = async (id) => {
    if(window.confirm("Supprimer ?")){
      await deleteUserAPI(id);
      const res = await getUsersAPI(filters);
      setData(res || []);
    }
  };

  const reset = () => {
    setForm({
      id:null,
      email:"",
      password:"",
      role:"USER",
      ministere:"",
      poste:""
    });
    setEditing(false);
    setShowAdd(false);
  };

  return(
    <div className="main-content">

      <div className="header">
        <h1>إدارة المستخدمين</h1>
      </div>

      <div className="card">

        {/* HEADER */}
        <div style={headerStyle}>
          <span style={iconBox}>🔎</span>
          <h2>بحث المستخدمين</h2>
        </div>

        {/* FILTERS */}
        <div style={filtersStyle}>
          <input placeholder="ID" onChange={(e)=>setFilters({...filters,id:e.target.value})}/>
          <input placeholder="Email" onChange={(e)=>setFilters({...filters,email:e.target.value})}/>
          <select onChange={(e)=>setFilters({...filters,ministere:e.target.value})}>
            <option value="">الوزارة</option>
            {ministeres.map((m,i)=>(<option key={i}>{m}</option>))}
          </select>
          <input placeholder="المنصب" onChange={(e)=>setFilters({...filters,poste:e.target.value})}/>
          <select onChange={(e)=>setFilters({...filters,role:e.target.value})}>
            <option value="">Role</option>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="SUPERVISEUR">SUPERVISEUR</option>
          </select>
        </div>

        {/* ADD BUTTON */}
        <button style={addBtn} onClick={()=>setShowAdd(!showAdd)}>
          ➕ إضافة مستخدم
        </button>

        {/* FORM */}
        {showAdd && (
          <div style={{marginBottom:"15px"}}>
            <input placeholder="Email"
              value={form.email}
              onChange={e=>setForm({...form,email:e.target.value})}/>

            <input type="password" placeholder="Password 🔒"
              value={form.password}
              onChange={e=>setForm({...form,password:e.target.value})}/>

            <select onChange={e=>setForm({...form,ministere:e.target.value})}>
              <option value="">الوزارة</option>
              {ministeres.map((m,i)=>(<option key={i}>{m}</option>))}
            </select>

            <input placeholder="المنصب"
              value={form.poste}
              onChange={e=>setForm({...form,poste:e.target.value})}/>

            <select onChange={e=>setForm({...form,role:e.target.value})}>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPERVISEUR">SUPERVISEUR</option>
            </select>

            <button style={saveBtn} onClick={submit}>
              {editing ? "تعديل" : "حفظ"}
            </button>
          </div>
        )}

        {/* TABLE */}
        <div className="table-container">

          <table style={{
            width:"100%",
            minWidth:"1200px",
            borderCollapse:"collapse"
          }}>

            <thead style={{
              background:"#111",
              color:"white",
              position:"sticky",
              top:0
            }}>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Password</th>
                <th>الوزارة</th>
                <th>المنصب</th>
                <th>Role</th>
                <th>إجراءات</th>
              </tr>
            </thead>

            <tbody>
              {data.map(user=>(
                <tr key={user.id} style={{textAlign:"center"}}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>

                  {/* ✅ PASSWORD NORMAL */}
                  <td>
                    {showPassword[user.id]
                      ? user.password
                      : "••••••"}

                    <span
                      style={{cursor:"pointer",marginLeft:"8px"}}
                      onClick={()=>togglePassword(user.id)}
                    >
                      {showPassword[user.id] ? <FaEyeSlash/> : <FaEye/>}
                    </span>
                  </td>

                  <td>{user.ministere || "-"}</td>
                  <td>{user.poste || "-"}</td>
                  <td>{user.role}</td>

                  <td style={{display:"flex",justifyContent:"center",gap:"8px"}}>
                    <button style={editBtn} onClick={()=>edit(user)}>
                      <FaEdit/>
                    </button>

                    <button style={deleteBtn} onClick={()=>remove(user.id)}>
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


// styles (unchanged)
const headerStyle={display:"flex",alignItems:"center",gap:"10px",background:"#0f172a",color:"white",padding:"10px",borderRadius:"10px"};
const iconBox={background:"#22c55e",padding:"8px",borderRadius:"8px"};
const filtersStyle={display:"flex",gap:"10px",margin:"10px 0",flexWrap:"wrap"};
const addBtn={background:"#22c55e",color:"white",padding:"8px 15px",border:"none",borderRadius:"8px"};
const saveBtn={background:"#3b82f6",color:"white",padding:"8px 15px",border:"none",borderRadius:"8px"};
const editBtn={background:"#3b82f6",color:"white",border:"none",padding:"5px 10px",borderRadius:"5px"};
const deleteBtn={background:"#ef4444",color:"white",border:"none",padding:"5px 10px",borderRadius:"5px"};