import { useState, useEffect } from "react";
import { addStagiaireAPI } from "../services/api";

function AddStagiaire() {

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");

  // 🔥 stages
  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState("");

  // 🔥 entreprises
  const [entreprises, setEntreprises] = useState([]);
  const [selectedEntreprise, setSelectedEntreprise] = useState("");

  // ===== GET DATA =====
  useEffect(() => {
    fetch("http://localhost:8080/api/stages")
      .then(res => res.json())
      .then(data => setStages(data));

    fetch("http://localhost:8080/api/entreprises")
      .then(res => res.json())
      .then(data => setEntreprises(data));
  }, []);

  // ===== SAVE =====
  const save = async () => {

    // 🔴 validation
    if (!selectedStage || !selectedEntreprise) {
      alert("اختر التربص و المؤسسة");
      return;
    }

    await addStagiaireAPI({
      nom,
      prenom,
      email,

      // 🔥 مهم
      stage: { id: Number(selectedStage) },

      // 🔥 مهم
      entreprise: { id: Number(selectedEntreprise) }
    });

    alert("تمت الإضافة");
  };

  return (
    <div>

      <h2>إضافة متربص</h2>

      <input
        onChange={e => setNom(e.target.value)}
        placeholder="الاسم"
      />

      <input
        onChange={e => setPrenom(e.target.value)}
        placeholder="اللقب"
      />

      <input
        onChange={e => setEmail(e.target.value)}
        placeholder="البريد"
      />

      {/* ===== SELECT ENTREPRISE ===== */}
      <select onChange={(e) => setSelectedEntreprise(e.target.value)} required>
        <option value="">اختر المؤسسة</option>
        {entreprises.map(ent => (
          <option key={ent.id} value={ent.id}>
            {ent.nom}
          </option>
        ))}
      </select>

      {/* ===== SELECT STAGE ===== */}
      <select onChange={(e) => setSelectedStage(e.target.value)} required>
        <option value="">اختر التربص</option>
        {stages.map(stage => (
          <option key={stage.id} value={stage.id}>
            {stage.intitule}
          </option>
        ))}
      </select>

      <button onClick={save}>
        حفظ
      </button>

    </div>
  );
}

export default AddStagiaire;