function StagiaireCard({ s }) {

  return (

    <div className="card">

      <h3>
        {s.nom} {s.prenom}
      </h3>

      <p>البريد الإلكتروني: {s.email}</p>

      <p>الهاتف: {s.telephone}</p>

    </div>

  );

}

export default StagiaireCard;