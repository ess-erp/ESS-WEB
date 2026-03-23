import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import { fetchAccountActivationData } from "../../states/OnlineApplicationState/Action";

const AccountActivation = () => {

    const { search } = useLocation();
    const dispatch = useDispatch();
    const query = new URLSearchParams(search);
    const userId = query.get("userId");

    console.log(userId);
    useEffect(() => {
        if (userId.length == 0 || userId == "undefined") return;

        dispatch(fetchAccountActivationData(userId));
    }, [dispatch, userId]);

    const navigate = useNavigate();

    const handleLink = () => {
        navigate("/");
    };

    return (
        <section className="bg-[url('/assets/img/White-Background.png')] bg-cover bg-center bg-no-repeat h-screen flex flex-col items-center justify-center relative overflow-hidden">
            <motion.h1
                className="text-6xl font-extrabold text-green-700 drop-shadow-lg text-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            >
                Congratulations!
            </motion.h1>
            <motion.p
                className="mt-4 text-lg text-gray-700 text-center max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 1 }}
            >
                Your temporary account for parent portal has been activated.
                Please login your portal account credentials.
            </motion.p>
            <motion.a
                onClick={handleLink}
                className="mt-6 flex items-center gap-2 text-green-700 font-semibold cursor-pointer hover:text-green-900 transition-all"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
            >
                Login
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

export default AccountActivation;