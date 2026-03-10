import { useState } from "react";
import { addStagiaireAPI } from "../services/api";

function AddStagiaire() {

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");

  const save = async () => {

    await addStagiaireAPI({
      nom,
      prenom,
      email
    });

    alert("تمت الإضافة");
  };

  return (

    <div>

      <h2>إضافة متربص</h2>

      <input onChange={e => setNom(e.target.value)} placeholder="الاسم"/>

      <input onChange={e => setPrenom(e.target.value)} placeholder="اللقب"/>

      <input onChange={e => setEmail(e.target.value)} placeholder="البريد"/>

      <button onClick={save}>
        حفظ
      </button>

    </div>

  );

}

export default AddStagiaire;