const OutlineRedBtn = ({ label, icon, onClick, type = "button", width }) => {
  const styles = {
    padding: "6px 12px",      
    fontSize: "0.875rem",
    backgroundColor: "transparent",
    color: "#d41414ff",
    fontWeight: "500",
    borderRadius: "6px",
    border: "2px solid #d41414ff",
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease",
    margin: "2px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",              
    whiteSpace: "nowrap",
    width: width || "auto",   // ✅ editable width (default = auto)
  };

  const hoverStyles = {
    backgroundColor: "#d41414ff",
    color: "#fff",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      style={styles}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = hoverStyles.backgroundColor;
        e.currentTarget.style.color = hoverStyles.color;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = styles.backgroundColor;
        e.currentTarget.style.color = styles.color;
      }}
    >
      {icon && <span>{icon}</span>}
      {label && <span>{label}</span>}
    </button>
  );
};

export default OutlineRedBtn;
