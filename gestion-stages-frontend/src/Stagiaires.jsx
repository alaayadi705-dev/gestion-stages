import { useEffect, useState } from "react";

function Stagiaires() {

  const [stagiaires, setStagiaires] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/stagiaires", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    .then(res => res.json())
    .then(data => setStagiaires(data));

  }, []);

  return (
    <div>
      <h2>Liste des stagiaires</h2>

      {stagiaires.map(s => (
        <div key={s.id}>
          {s.nom} {s.prenom} - {s.email}
        </div>
      ))}

    </div>
  );
}

export default Stagiaires;