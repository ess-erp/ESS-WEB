import { AnimatePresence, motion } from "framer-motion";
import GreenBtn from "./GreenBtn";
import RedBtn from "./RedBtn";
import YellowBtn from "./YellowBtn";
import BlueBtn from "./BlueBtn";

const ModalComponent = ({
    isOpen,
    onClose,
    title,
    body,
    buttons = [],
    backgroundImage,
    size,
    maxHeight
}) => {
    const getButtonComponent = (type) => {
        switch (type) {
            case "green":
                return GreenBtn;
            case "red":
                return RedBtn;
            case "yellow":
                return YellowBtn;
            default:
                return BlueBtn;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={
                        backgroundImage
                            ? {
                                backgroundImage: `url(${backgroundImage})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }
                            : {
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                            }
                    }
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <motion.div
                        className={`bg-white rounded-lg shadow-lg p-6 relative ${size ? size : "w-96"}`}
                        style={{
                            maxHeight: maxHeight || 'auto', // <-- use the prop here
                            overflowY: 'auto',              // scroll content if it exceeds maxHeight
                        }}
                        initial={{ y: -200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -200, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold text-center text-green-700">{title}</h2>
                        <hr className="border-t-1 border-solid border-gray-400 my-6" />

                        {typeof body === "string" ? (
                            <p className="mb-4 text-center">{body}</p>
                        ) : (
                            <div className="mb-4 text-center">{body}</div>
                        )}

                        <hr className="border-t-1 border-solid border-gray-400 my-6" />

                        <div className={`grid grid-cols-${buttons.length} gap-4`}>
                            {buttons.map((btn, index) => {
                                const ButtonComponent = getButtonComponent(btn.type);
                                return (
                                    <ButtonComponent
                                        key={index}
                                        label={btn.label}
                                        onClick={() => {
                                            if (btn.onClick) btn.onClick();

                                            // only close modal if flag is true
                                            if (btn.closeOnClick !== false) {
                                                onClose();
                                            }
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalComponent;
