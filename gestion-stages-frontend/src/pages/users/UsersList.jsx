import { useEffect, useState } from "react";
import {
  getUsersAPI,
  addUserAPI,
  updateUserAPI,
  deleteUserAPI,
  getMinisteresAPI
} from "../../services/api";

import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import "../../styles/dashboard.css";

export default function UsersList(){

  const currentUserStr = localStorage.getItem("user");
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : {};
  const isSuperviseur = currentUser.role === "SUPERVISEUR";
  const isUser = currentUser.role === "USER";
  const isAdmin = currentUser.role === "ADMIN";

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

  const [ministeres,setMinisteres]=useState([]);
  const [form,setForm]=useState({
    id:null,
    email:"",
    password:"",
    role:"USER",
    ministere:"",
    poste:"",
    cin: "",
    nom: "",
    prenom: "",
    cnrpsCnss: "",
    nationalite: "TUNISIENNE",
    dateNaissance: "",
    lieuNaissance: "",
    rib: "",
    fonction: "",
    grade: "",
    etat: true
  });

  useEffect(()=>{
    load();
    loadMinisteres();
  },[filters]);

  const load = async () => {
    const res = await getUsersAPI(filters);
    setData(Array.isArray(res) ? res : []);
  };

  const loadMinisteres = async () => {
    const res = await getMinisteresAPI();
    setMinisteres(Array.isArray(res) ? res : []);
  };

  const submit = async () => {
    if(!form.email){
      alert("أدخل email");
      return;
    }

    if(!editing && !form.password){
      alert("أدخل password");
      return;
    }

    const payload = {
      ...form,
      ministere: form.ministere ? { nom: form.ministere } : null
    };

    try {
      if(editing){
        await updateUserAPI(form.id, payload);
        alert("✅ تم التعديل بنجاح");
      }else{
        await addUserAPI(payload);
        alert("✅ تم الإضافة بنجاح");
      }
      reset();
      load();
    } catch (err) {
      console.error("Submit error:", err);
      alert("❌ فشل في الحفظ: " + err.message);
    }
  };

  const edit = (user) => {
    setForm({
      ...user,
      ministere: user.ministere?.nom || "",
      password: "" // Clear password for security, only update if typed
    });
    setEditing(true);
    setShowAdd(true);
  };

  const remove = async (id) => {
    if(window.confirm("Supprimer ?")){
      await deleteUserAPI(id);
      const res = await getUsersAPI(filters);
      setData(Array.isArray(res) ? res : []);
    }
  };

  const reset = () => {
    setForm({
      id:null,
      email:"",
      password:"",
      role:"USER",
      ministere:"",
      poste:"",
      cin: "",
      nom: "",
      prenom: "",
      cnrpsCnss: "",
      nationalite: "TUNISIENNE",
      dateNaissance: "",
      lieuNaissance: "",
      rib: "",
      fonction: "",
      grade: "",
      etat: true
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
        {/* SECRECHER/FILTERS FOR ADMIN/SUPERVISEUR ONLY */}
        {!isUser && (
          <>
            <div style={headerStyle}>
              <span style={iconBox}>🔎</span>
              <h2>بحث المستخدمين</h2>
            </div>

            <div style={filtersStyle}>
              <input placeholder="المعرف" onChange={(e)=>setFilters({...filters,id:e.target.value})}/>
              <input placeholder="البريد الإلكتروني" onChange={(e)=>setFilters({...filters,email:e.target.value})}/>
              <select onChange={(e)=>setFilters({...filters,ministere:e.target.value})}>
                <option value="">الوزارة</option>
                {ministeres.map((m,i)=>(<option key={m.id || i} value={m.nom}>{m.nom}</option>))}
              </select>
              <input placeholder="المنصب" onChange={(e)=>setFilters({...filters,poste:e.target.value})}/>
              <select onChange={(e)=>setFilters({...filters,role:e.target.value})}>
                <option value="">الدور</option>
                <option value="USER">مستخدم (USER)</option>
                <option value="SUPERVISEUR">مشرف (SUPERVISEUR)</option>
                {isAdmin && <option value="ADMIN">مدير (ADMIN)</option>}
              </select>
            </div>
          </>
        )}

        {/* ADD BUTTON */}
        {!isUser && (
          <button style={addBtn} onClick={()=>setShowAdd(!showAdd)}>
            ➕ إضافة مستخدم
          </button>
        )}

        {showAdd && (
          <div style={{
            marginBottom: "20px", 
            background: "rgba(30, 41, 59, 0.85)", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid rgba(99, 102, 241, 0.25)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "15px"
          }}>
            <div style={{gridColumn: "1 / -1", borderBottom: "2px solid #cbd5e1", paddingBottom: "10px", marginBottom: "10px"}}>
              <h3 style={{margin: 0, color: "#1e293b"}}>بيانات الحساب / Compte</h3>
            </div>
            
            <input placeholder="البريد الإلكتروني" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
            <input type="password" placeholder={editing ? "Password (laisser vide pour ne pas changer)" : "Password 🔒"} value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
            
            <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
              <option value="USER">مستخدم (USER)</option>
              <option value="SUPERVISEUR">مشرف (SUPERVISEUR)</option>
              {isAdmin && <option value="ADMIN">مدير (ADMIN)</option>}
            </select>

            <select value={form.ministere || ""} onChange={e=>setForm({...form,ministere:e.target.value})}>
              <option value="">الوزارة</option>
              {ministeres.map((m,i)=>(<option key={m.id || i} value={m.nom}>{m.nom}</option>))}
            </select>

            <div style={{gridColumn: "1 / -1", borderBottom: "2px solid #cbd5e1", paddingBottom: "10px", margin: "10px 0"}}>
              <h3 style={{margin: 0, color: "#1e293b"}}>البيانات الشخصية / Profil</h3>
            </div>

            <input placeholder="بطاقة تعريف وطنية / CIN" value={form.cin} onChange={e=>setForm({...form,cin:e.target.value})}/>
            <input placeholder="اللقب / Nom" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})}/>
            <input placeholder="الاسم / Prénom" value={form.prenom} onChange={e=>setForm({...form,prenom:e.target.value})}/>
            <input placeholder="CNRPS أو CNSS" value={form.cnrpsCnss} onChange={e=>setForm({...form,cnrpsCnss:e.target.value})}/>
            <input placeholder="الجنسية / Nationalité" value={form.nationalite} onChange={e=>setForm({...form,nationalite:e.target.value})}/>
            
            <div style={{display:"flex", flexDirection:"column"}}>
              <label style={{fontSize:"12px", color:"#64748b"}}>تاريخ الولادة</label>
              <input type="date" value={form.dateNaissance} onChange={e=>setForm({...form,dateNaissance:e.target.value})}/>
            </div>

            <input placeholder="مكانها / Lieu de naissance" value={form.lieuNaissance} onChange={e=>setForm({...form,lieuNaissance:e.target.value})}/>
            <input placeholder="رقم الحساب البنكي / RIB" value={form.rib} onChange={e=>setForm({...form,rib:e.target.value})}/>
            <input placeholder="الخطة الوظيفية / Fonction" value={form.fonction} onChange={e=>setForm({...form,fonction:e.target.value})}/>
            <input placeholder="الرتبة / Grade" value={form.grade} onChange={e=>setForm({...form,grade:e.target.value})}/>
            
            <label style={{display:"flex", alignItems:"center", gap:"10px", cursor:"pointer"}}>
              <input type="checkbox" checked={form.etat} onChange={e=>setForm({...form,etat:e.target.checked})}/>
              مفعل / Actif
            </label>

            <div style={{gridColumn: "1 / -1", display: "flex", gap: "10px", marginTop: "10px"}}>
              <button style={saveBtn} onClick={submit}>
                {editing ? "تعديل" : "حفظ"}
              </button>
              <button style={{...deleteBtn, background: "#64748b"}} onClick={reset}>إلغاء</button>
            </div>
          </div>
        )}

        <div className="table-container">
          <table style={{
            width:"100%",
            minWidth:"1200px",
            borderCollapse:"collapse"
          }}>

            <thead style={{
              background:"linear-gradient(135deg, #312e81, #4338ca)",
              color:"white",
              position:"sticky",
              top:0
            }}>
              <tr>
                <th>CIN</th>
                <th>الاسم</th>
                <th>اللقب</th>
                <th>البريد الإلكتروني</th>
                <th>CNRPS / CNSS</th>
                <th>الهيكل المعني</th>
                <th>تاريخ الإضافة</th>
                <th>الحالة</th>
                <th>الدور</th>
                <th>إجراءات</th>
              </tr>
            </thead>

            <tbody>
              {data.map(user=>(
                <tr key={user.id} style={{textAlign:"center"}}>
                  <td>{user.cin || "-"}</td>
                  <td>{user.prenom || "-"}</td>
                  <td>{user.nom || "-"}</td>
                  <td>{user.email || "-"}</td>
                  <td>{user.cnrpsCnss || "-"}</td>
                  <td>{user.ministere?.nom || "-"}</td>
                  <td>{user.dateAjout ? new Date(user.dateAjout).toLocaleDateString("fr-FR") : "-"}</td>
                  <td>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "bold",
                      background: user.etat ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
                      color: user.etat ? "#4ade80" : "#fca5a5"
                    }}>
                      {user.etat ? "مفعل" : "معطل"}
                    </span>
                  </td>
                  <td>{user.role === "ADMIN" ? "مدير" : user.role === "SUPERVISEUR" ? "مشرف" : "مستخدم"}</td>

                  <td style={{display:"flex",justifyContent:"center",gap:"8px"}}>
                    {!isUser && (
                      <>
                        <button style={editBtn} onClick={()=>edit(user)}>
                          <FaEdit/>
                        </button>
                        <button style={deleteBtn} onClick={()=>remove(user.id)}>
                          <FaTrash/>
                        </button>
                      </>
                    )}
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
const headerStyle={display:"flex",alignItems:"center",gap:"10px",background:"linear-gradient(135deg, #312e81, #4338ca)",color:"white",padding:"10px",borderRadius:"12px",border:"1px solid rgba(99, 102, 241, 0.3)"};
const iconBox={background:"linear-gradient(135deg, #6366f1, #8b5cf6)",padding:"8px",borderRadius:"8px",boxShadow:"0 0 15px rgba(99, 102, 241, 0.5)"};
const filtersStyle={display:"flex",gap:"10px",margin:"10px 0",flexWrap:"wrap"};
const addBtn={background:"linear-gradient(135deg, #22c55e, #16a34a)",color:"white",padding:"8px 15px",border:"none",borderRadius:"10px",boxShadow:"0 4px 15px rgba(34, 197, 94, 0.3)",fontWeight:"600"};
const saveBtn={background:"linear-gradient(135deg, #6366f1, #8b5cf6)",color:"white",padding:"8px 15px",border:"none",borderRadius:"10px",boxShadow:"0 4px 15px rgba(99, 102, 241, 0.3)",fontWeight:"600"};
const editBtn={background:"linear-gradient(135deg, #6366f1, #8b5cf6)",color:"white",border:"none",padding:"5px 10px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(99, 102, 241, 0.3)"};
const deleteBtn={background:"linear-gradient(135deg, #ef4444, #dc2626)",color:"white",border:"none",padding:"5px 10px",borderRadius:"8px",boxShadow:"0 4px 12px rgba(239, 68, 68, 0.3)"};