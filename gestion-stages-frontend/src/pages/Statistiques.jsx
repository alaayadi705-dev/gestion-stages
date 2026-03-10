import React, { useEffect, useState } from "react";

export default function Statistiques() {

  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/statistiques")
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="card">

      <h2>États et Statistiques</h2>

      <table>
        <thead>
          <tr>
            <th>المؤشر</th>
            <th>القيمة</th>
          </tr>
        </thead>

        <tbody>

          <tr>
            <td>Stages en cours</td>
            <td>{stats.stagesEnCours}</td>
          </tr>

          <tr>
            <td>Stages clôturés</td>
            <td>{stats.stagesClotures}</td>
          </tr>

          <tr>
            <td>Rapports déposés</td>
            <td>{stats.rapportsDeposes}</td>
          </tr>

          <tr>
            <td>Rapports validés</td>
            <td>{stats.rapportsValides}</td>
          </tr>

        </tbody>
      </table>

      <br />

      <h3>Stages par pays</h3>
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

      <br />

      <h3>Stagiaires par pays</h3>
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

      <br />

      <h3>Coût total par stage</h3>
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

      <br />

      <h3>Coût total par pays</h3>
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
  );
}