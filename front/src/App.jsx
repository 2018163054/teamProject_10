import { useState } from "react";
import Sidebar from "./components/sidebar";
import BarrierFreeMap from "./components/barrierWithSearch";
import { motion, AnimatePresence } from "framer-motion";
import MapWithCards from "./components/MapWithCards";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row overflow-y-scroll">
      {/* 모바일 전용 햄버거 버튼 */}
      <div className="sm:hidden p-4 bg-blue-700 text-white flex">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="text-white font-bold text-xl"
        >
          ☰
        </button>
        <div className="flex-1 flex justify-center items-center text-xl font-bold">
          Wheel Map
        </div>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white z-50 shadow-xl sm:hidden"
          >
            <div className="flex justify-end p-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white text-2xl"
              >
                ✕
              </button>
            </div>
            <Sidebar
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setUserInfo={setUserInfo}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-hidden">
        <BarrierFreeMap isLoggedIn={isLoggedIn} userInfo={userInfo} />
      </div>
    </div>
  );
}
