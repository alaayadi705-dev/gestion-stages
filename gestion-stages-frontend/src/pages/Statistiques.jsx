import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Statistiques() {

  // ===== STATS =====
  const [stats, setStats] = useState(null);

  // ===== FILTER =====
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pays, setPays] = useState("");
  const [stageId, setStageId] = useState(""); // ✅ ADDED

  const [results, setResults] = useState([]);

  // ===== FETCH STATS =====
  useEffect(() => {
    fetch("http://localhost:8080/api/statistiques")
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  // ===== SEARCH =====
  const handleSearch = async () => {
    let url = "http://localhost:8080/api/stages/search?";

    if (startDate) url += `start=${startDate}&`;
    if (endDate) url += `end=${endDate}&`;
    if (pays) url += `pays=${pays}&`;
    if (stageId) url += `id=${stageId}&`; // ✅ ADDED

    const res = await fetch(url);
    const data = await res.json();

    setResults(data);
  };

  // ===== PDF =====
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text("Liste des stages", 14, 10);

    autoTable(doc, {
      head: [[
        "ID","Titre","Date debut","Date fin",
        "Pays","Statut",
        "Nom","Prenom","Entreprise",
        "Montant","Fichier","Rapport"
      ]],
      body: results.map(s => [
        s.id,
        s.intitule,
        s.dateDebut,
        s.dateFin,
        s.pays,
        s.statut,
        s.nom || "---",
        s.prenom || "---",
        s.entreprise || "---",
        s.montant || 0,
        s.fichier || "---",
        s.statutRapport || "---"
      ])
    });

    doc.save("stages.pdf");
  };

  if (!stats) return <div>جاري التحميل...</div>;

  return (
    <div className="stats-page">

      <h2>📊 إحصائيات التربصات</h2>

      {/* ===== FILTER ===== */}
      <div className="card">
        <h3>🔍 البحث عن التربصات</h3>

        <input type="date" onChange={(e)=>setStartDate(e.target.value)} />
        <input type="date" onChange={(e)=>setEndDate(e.target.value)} />

        <input
          type="text"
          placeholder="الدولة"
          onChange={(e)=>setPays(e.target.value)}
        />

        {/* ✅ ADDED INPUT ID */}
        <input
          type="number"
          placeholder="ID التربص"
          onChange={(e)=>setStageId(e.target.value)}
        />

        <button onClick={handleSearch}>
          Afficher
        </button>
      </div>

      {/* ===== RESULTS ===== */}
      <div className="card">
        <h3>📋 نتائج البحث</h3>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>عنوان</th>
              <th>بداية</th>
              <th>نهاية</th>
              <th>المدة</th>
              <th>البلد</th>
              <th>الحالة</th>

              <th>الاسم</th>
              <th>اللقب</th>

              <th>المؤسسة</th>
              <th>المبلغ</th>

              <th>الملف</th>
              <th>حالة التقرير</th>
            </tr>
          </thead>

          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan="13">لا توجد نتائج</td>
              </tr>
            ) : (
              results.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.intitule}</td>
                  <td>{item.dateDebut}</td>
                  <td>{item.dateFin}</td>
                  <td>{item.duree}</td>
                  <td>{item.pays}</td>
                  <td>{item.statut}</td>

                  <td>{item.nom || "---"}</td>
                  <td>{item.prenom || "---"}</td>

                  <td>{item.entreprise || "---"}</td>

                  <td>{item.montant || 0}</td>

                  <td>{item.fichier || "---"}</td>
                  <td>{item.statutRapport || "---"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <button onClick={downloadPDF}>
          📥 Télécharger PDF
        </button>

      </div>

      {/* ===== CARDS ===== */}
      <div className="stats-cards">

        <div className="card-stat">
          <h3>{stats.stagesEnCours}</h3>
          <p>تربصات جارية</p>
        </div>

        <div className="card-stat">
          <h3>{stats.stagesClotures}</h3>
          <p>تربصات منتهية</p>
        </div>

        <div className="card-stat">
          <h3>{stats.rapportsDeposes}</h3>
          <p>تقارير مودعة</p>
        </div>

        <div className="card-stat">
          <h3>{stats.rapportsValides}</h3>
          <p>تقارير مصادق عليها</p>
        </div>

      </div>

      

      {/* ===== TABLE ===== */}
      <div className="card">
        <h3>📋 المؤشرات العامة</h3>

        <table>
          <tbody>
            <tr>
              <td>تربصات جارية</td>
              <td>{stats.stagesEnCours}</td>
            </tr>
            <tr>
              <td>تربصات منتهية</td>
              <td>{stats.stagesClotures}</td>
            </tr>
            <tr>
              <td>تقارير مودعة</td>
              <td>{stats.rapportsDeposes}</td>
            </tr>
            <tr>
              <td>تقارير مصادق عليها</td>
              <td>{stats.rapportsValides}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ===== STAGES PAR PAYS ===== */}
      <div className="card">
        <h3>🌍 التربصات حسب البلدان</h3>
        <table>
          <tbody>
            {stats.stagesParPays.map((item, index) => (
              <tr key={index}>
                <td>{item[0]}</td>
                <td>{item[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== STAGIAIRES PAR PAYS ===== */}
      <div className="card">
        <h3>👨‍🎓 المتربصون حسب البلدان</h3>
        <table>
          <tbody>
            {stats.stagiairesParPays.map((item, index) => (
              <tr key={index}>
                <td>{item[0]}</td>
                <td>{item[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== COST PAR STAGE ===== */}
      <div className="card">
        <h3>💰 التكلفة حسب التربص</h3>
        <table>
          <tbody>
            {stats.coutParStage.map((item, index) => (
              <tr key={index}>
                <td>{item[0]}</td>
                <td>{item[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== COST PAR PAYS ===== */}
      <div className="card">
        <h3>💸 التكلفة حسب البلد</h3>
        <table>
          <tbody>
            {stats.coutParPays.map((item, index) => (
              <tr key={index}>
                <td>{item[0]}</td>
                <td>{item[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}