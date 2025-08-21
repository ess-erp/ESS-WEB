const OutlineGreenBtn = ({ label, onClick, type = "button" }) => {
  const styles = {
    padding: "6px 12px",      // small padding
    fontSize: "0.875rem",     // small text
    backgroundColor: "transparent",
    color: "#009b2eff",
    fontWeight: "500",
    borderRadius: "6px",
    border: "2px solid #009b2eff",
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease",
    margin: "2px",
    whiteSpace: "nowrap",     // prevent text wrapping
  };

  const hoverStyles = {
    backgroundColor: "#009b2eff",
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
      {label}
    </button>
  );
};

export default OutlineGreenBtn;