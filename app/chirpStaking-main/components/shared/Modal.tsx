import React, { type SetStateAction, type Dispatch, useEffect } from "react";
import type { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";

const Modal: FC<{
  children: React.ReactNode;
  className: string;
  toggleModal: boolean;
  handleToggle: Dispatch<SetStateAction<boolean>>;
}> = ({ children, toggleModal, className, handleToggle }) => {
  useEffect(() => {
    if (toggleModal) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [toggleModal]);

  return (
    <AnimatePresence>
      {toggleModal && (
        <div
          className={`fixed top-0 left-0 z-[999] w-full h-full flex items-center justify-center px-4`}
        >
          <motion.div
            className="absolute top-0 left-0 z-[-1] block h-full w-full bg-[#141313]/80 backdrop-blur-sm"
            onClick={() => handleToggle(!toggleModal)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="bg-[#dd3a3d]/80 backdrop-blur-md rounded-lg relative px-4 w-5/6 sm:w-1/2 sm:max-w-1/2 overflow-auto max-h-[80vh]"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ transform: "translate3d(-50%, 0, 0)" }}
          >
            <div className={`overflow-y-auto overflow-x-hidden ${className}`}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
