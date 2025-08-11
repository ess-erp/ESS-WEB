const RedBtn = ({ label, onClick, type = "button" }) => {
       const styles = {
        // width: "100%",
        padding: "10px 20px",
        backgroundColor: "#eb2525ff", // blue-600 equivalent
        color: "#fff",
        fontWeight: "500",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        transition: "background-color 0.2s ease",
        margin: "2px"
    };

    const hoverStyles = {
        backgroundColor: "#d81d1dff", // blue-700 equivalent
    };
    return (

        <button
            type={type}
            onClick={onClick}
            style={styles}
            onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = hoverStyles.backgroundColor)
            }
            onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = styles.backgroundColor)
            }
        >
            {label}
        </button>
    );
};

export default RedBtn;