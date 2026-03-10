import flag from "../assets/tunisia.png";

function Header() {

  return (

    <div className="header">

      <img src={flag} alt="Tunisia" className="flag" />

      <h2 style={{marginRight:"15px"}}>
        الجمهورية التونسية - منظومة إدارة التربصات
      </h2>

    </div>

  );

}

export default Header;