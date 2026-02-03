import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";

const CongratsLetter = () => {
    const navigate = useNavigate();

    const handleLink = () => {
        navigate("/employeeonlineapplication");
    };

    return (
        <section className="bg-[url('/assets/img/White-Background.png')] bg-cover bg-center bg-no-repeat h-screen flex flex-col items-center justify-center relative overflow-hidden">
            
            {/* Confetti animation */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <span
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-confetti"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                        }}
                    ></span>
                ))}
            </div>

            {/* Congrats text animation */}
            <motion.h1
                className="text-6xl font-extrabold text-green-700 drop-shadow-lg text-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            >
                🎉 Congratulations! 🎉
            </motion.h1>

            {/* Message */}
            <motion.p
                className="mt-4 text-lg text-gray-700 text-center max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 1 }}
            >
                Your application has been sent to the hr. Please wait for 2-3 business days to process your application.
            </motion.p>

            {/* Styled link with icon */}
            <motion.a
                onClick={handleLink}
                className="mt-6 flex items-center gap-2 text-green-700 font-semibold cursor-pointer hover:text-green-900 transition-all"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
            >
                Apply Again
                <HiArrowRight className="text-xl transition-transform group-hover:translate-x-1" />
            </motion.a>

            <style>{`
                @keyframes confetti-fall {
                    0% {
                        transform: translateY(-100vh) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
                .animate-confetti {
                    animation-name: confetti-fall;
                    animation-iteration-count: infinite;
                }
            `}</style>
        </section>
    );
};

export default CongratsLetter;
