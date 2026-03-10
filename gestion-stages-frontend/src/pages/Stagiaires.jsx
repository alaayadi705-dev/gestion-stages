import { useEffect, useState } from "react";
import { getStagiairesAPI, deleteStagiaireAPI } from "../services/api";

function Stagiaires() {

  const [data, setData] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    getStagiairesAPI().then(setData);
  };

  const remove = async (id) => {

    await deleteStagiaireAPI(id);

    load();
  };

  return (

    <div>

      <h2>قائمة المتربصين</h2>

      {data.map(s => (

        <div className="card" key={s.id}>

          <h3>{s.nom} {s.prenom}</h3>

          <p>{s.email}</p>

          <button onClick={() => remove(s.id)}>
            حذف
          </button>

        </div>

      ))}

    </div>

  );

}

export default Stagiaires;