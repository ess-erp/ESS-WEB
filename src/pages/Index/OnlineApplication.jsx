import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import GreenBtn from '../../components/ButtonsComponents/GreenBtn';
import NewEnrollyComponent from '../../components/OnlineAppComponents/NewEnrollyComponent';
import ReturneeEnrollyComponent from '../../components/OnlineAppComponents/ReturneeEnrollyComponent';

const OnlineApplication = () => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    document.title = 'Online Application | Student';
    setIsOpen(true);
  }, []);

  const [selectedType, setSelectedType] = useState(null);

  const handleModalClick = (type) => {
    setSelectedType(type);
    setIsOpen(false);
  };

  return (
    <section className="bg-[url('/assets/img/White-Background.png')] bg-cover bg-center bg-no-repeat h-screen flex items-center justify-center">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{
              backgroundImage: `url('/assets/img/White-Background.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Modal box animation */}
            <motion.div
              className="bg-white rounded-lg shadow-lg w-96 p-6 relative"
              initial={{ y: -200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -200, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Close button */}
              {/* <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button> */}
              <h2
                className="text-xl font-bold text-center text-green-700">
                Welcome to Elizabeth Seton School Online Application
              </h2>
              <hr className="border-t-1 border-solid border-gray-400 my-6" />
              <p className="mb-4 text-center">
                Please click the corresponding button below to continue the online application.
              </p>
              <hr className="border-t-1 border-solid border-gray-400 my-6" />
              <div className="grid grid-cols-2">
                <GreenBtn label="New" onClick={() => handleModalClick("new")} />
                <GreenBtn label="Returnee" onClick={() => handleModalClick("returnee")} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <>
        {selectedType === "new" && <NewEnrollyComponent />}
        {selectedType === "returnee" && <ReturneeEnrollyComponent />}
      </>
    </section>

  );
};

export default OnlineApplication;