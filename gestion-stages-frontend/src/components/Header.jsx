import flag from "../assets/tunisia.png";

function Header() {

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(49, 46, 129, 0.7))",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      padding: "15px 25px",
      display: "flex",
      alignItems: "center",
      gap: "15px",
      borderBottom: "1px solid rgba(99, 102, 241, 0.25)",
      borderRadius: "16px",
      marginBottom: "20px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
    }}>
      <img src={flag} alt="Tunisia" style={{
        width: "36px",
        filter: "drop-shadow(0 2px 8px rgba(99, 102, 241, 0.4))",
        borderRadius: "6px"
      }} />
      <h2 style={{
        marginRight: "15px",
        color: "#f1f5f9",
        fontSize: "16px",
        fontWeight: 600,
        textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)"
      }}>
        الجمهورية التونسية - منظومة إدارة التربصات
      </h2>
    </div>
  );
}

export default Header;
