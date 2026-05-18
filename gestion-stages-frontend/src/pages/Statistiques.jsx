import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaChartBar, FaFilePdf, FaSearch, FaGlobe, FaUserGraduate, FaMoneyBillWave } from "react-icons/fa";
import { getStatistiquesAPI, searchStagesAPI } from "../services/api";
import "../styles/dashboard.css";

export default function Statistiques() {

  const [stats, setStats] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    pays: "",
    stageId: ""
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getStatistiquesAPI();
      setStats(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false); // 🔥 Prevent stuck on loading
    }
  };

  const handleSearch = async () => {
    const searchFilters = {};
    if (filters.startDate) searchFilters.start = filters.startDate;
    if (filters.endDate) searchFilters.end = filters.endDate;
    if (filters.pays) searchFilters.pays = filters.pays;
    if (filters.stageId) searchFilters.id = filters.stageId;

    try {
      const data = await searchStagesAPI(searchFilters);
      setResults(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF('landscape');
    doc.text("تقرير التربصات - الجمهورية التونسية", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [[
        "ID", "Titre", "Date Debut", "Date Fin", "Pays", "Statut", "Stagiaire", "Entreprise", "Coût"
      ]],
      body: results.map(s => [
        s.id, s.intitule, s.dateDebut, s.dateFin, s.pays, s.statut, 
        `${s.nom || ""} ${s.prenom || ""}`, s.entreprise || "---", s.montant || 0
      ])
    });
    doc.save("rapport-stages.pdf");
  };

  if (loading) return <div className="main-content"><h2 style={{color:"#c7d2fe"}}>جاري التحميل...</h2></div>;
  
  if (!stats) return <div className="main-content"><h2 style={{color:"#fca5a5"}}>خطأ في تحميل البيانات. يرجى المحاولة لاحقاً.</h2></div>;

  return (
    <div className="main-content">
      <div className="header">
        <h1>📊 لوحة الإحصائيات والتقارير</h1>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="stats" style={{marginTop: "20px", marginBottom: "40px", gap: "20px"}}>
        <div className="stat-card blue">
          <FaChartBar className="stat-icon" style={{color: "#a5b4fc"}} />
          <div className="stat-number" style={{color: "#a5b4fc"}}>{stats.stagesEnCours + stats.stagesClotures}</div>
          <div className="stat-title">إجمالي التربصات</div>
        </div>
        <div className="stat-card green">
          <FaUserGraduate className="stat-icon" style={{color: "#4ade80"}} />
          <div className="stat-number" style={{color: "#4ade80"}}>{stats.rapportsValides}</div>
          <div className="stat-title">تقارير مصادق عليها</div>
        </div>
        <div className="stat-card yellow">
          <FaChartBar className="stat-icon" style={{color: "#fde047"}} />
          <div className="stat-number" style={{color: "#fde047"}}>{stats.stagesEnCours}</div>
          <div className="stat-title">تربصات جارية</div>
        </div>
        <div className="stat-card red">
          <FaMoneyBillWave className="stat-icon" style={{color: "#f87171"}} />
          <div className="stat-number" style={{color: "#f87171"}}>{stats.coutTotal || 0} TND</div>
          <div className="stat-title">التكلفة الإجمالية</div>
        </div>
      </div>

      <div className="grid-container" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px"}}>
        
        {/* STAGES PAR PAYS */}
        <div className="card">
          <div style={{...sectionHeader, borderBottom: "1px solid rgba(99, 102, 241, 0.2)"}}>
            <FaGlobe style={{color: "#4ade80"}} /> <h3 style={{color: "#f1f5f9"}}>التربصات حسب البلدان</h3>
          </div>
          <table className="mini-table">
            <thead><tr><th>البلد</th><th>العدد</th></tr></thead>
            <tbody>
              {stats?.stagesParPays?.length > 0 ? stats.stagesParPays.map((item, i) => (
                <tr key={i}><td>{item[0]}</td><td><b style={{color: "#a5b4fc"}}>{item[1]}</b></td></tr>
              )) : <tr><td colSpan="2">لا توجد بيانات</td></tr>}
            </tbody>
          </table>
        </div>

        {/* STAGIAIRES PAR PAYS */}
        <div className="card">
          <div style={{...sectionHeader, borderBottom: "1px solid rgba(99, 102, 241, 0.2)"}}>
            <FaUserGraduate style={{color: "#a5b4fc"}} /> <h3 style={{color: "#f1f5f9"}}>المتربصون حسب البلدان</h3>
          </div>
          <table className="mini-table">
            <thead><tr><th>البلد</th><th>العدد</th></tr></thead>
            <tbody>
              {stats?.stagiairesParPays?.length > 0 ? stats.stagiairesParPays.map((item, i) => (
                <tr key={i}><td>{item[0]}</td><td><b style={{color: "#a5b4fc"}}>{item[1]}</b></td></tr>
              )) : <tr><td colSpan="2">لا توجد بيانات</td></tr>}
            </tbody>
          </table>
        </div>

      </div>

      {/* ADVANCED SEARCH & EXPORT */}
      <div className="card" style={{marginBottom: "30px"}}>
        <div style={{...sectionHeader, borderBottom: "1px solid rgba(99, 102, 241, 0.2)"}}>
          <FaSearch style={{color: "#fde047"}} /> <h3 style={{color: "#f1f5f9"}}>استخراج التقارير والبحث المتقدم</h3>
        </div>
        
        <div style={{display: "flex", gap: "10px", flexWrap: "wrap", margin: "15px 0"}}>
          <input type="date" className="custom-input" onChange={(e)=>setFilters({...filters, startDate: e.target.value})} />
          <input type="date" className="custom-input" onChange={(e)=>setFilters({...filters, endDate: e.target.value})} />
          <input placeholder="الدولة" className="custom-input" onChange={(e)=>setFilters({...filters, pays: e.target.value})} />
          <input type="number" placeholder="ID التربص" className="custom-input" onChange={(e)=>setFilters({...filters, stageId: e.target.value})} />
          <button className="add-btn" style={{margin: 0}} onClick={handleSearch}>بحث</button>
        </div>

        {results.length > 0 && (
          <>
            <div className="table-container" style={{maxHeight: "300px", marginTop: "20px"}}>
              <table style={{minWidth: "1200px"}}>
                <thead>
                  <tr>
                    <th>ID</th><th>العنوان</th><th>البلد</th><th>المتربص</th><th>التكلفة</th><th>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((item, index) => (
                    <tr key={index} style={{textAlign:"center"}}>
                      <td>{item.id}</td><td>{item.intitule}</td><td>{item.pays}</td>
                      <td>{item.nom} {item.prenom}</td><td>{item.montant || 0}</td><td>{item.statut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="add-btn" style={{marginTop: "20px", background: "linear-gradient(135deg, #ef4444, #dc2626)"}} onClick={downloadPDF}>
              <FaFilePdf /> تحميل التقرير PDF
            </button>
          </>
        )}
      </div>

    </div>
  );
}

const sectionHeader = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "15px",
  borderBottom: "1px solid rgba(99, 102, 241, 0.2)",
  paddingBottom: "10px"
};