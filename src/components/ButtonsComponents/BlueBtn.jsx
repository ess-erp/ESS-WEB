const BlueBtn = ({
    className = null,
    label,
    onClick,
    type = "button",
    disabled = false,
}) => {
    const useInlineStyle = !className;

    const styles = {
        padding: "10px 20px",
        backgroundColor: "#2563eb",
        color: "#fff",
        fontWeight: "500",
        borderRadius: "8px",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        transition: "background-color 0.2s ease",
        margin: "2px",
        opacity: disabled ? 0.6 : 1,
    };

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={!disabled ? onClick : undefined}
            className={
                className
                    ? `${className} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`
                    : undefined
            }
            style={useInlineStyle ? styles : undefined}
            onMouseOver={
                useInlineStyle && !disabled
                    ? (e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")
                    : undefined
            }
            onMouseOut={
                useInlineStyle && !disabled
                    ? (e) => (e.currentTarget.style.backgroundColor = "#2563eb")
                    : undefined
            }
        >
            {label}
        </button>
    );
};

export default BlueBtn;
