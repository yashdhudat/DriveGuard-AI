import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LandingPage from "./pages/LandingPage";
import WelcomePage from "./pages/WelcomePage";
import Dashboard from "./pages/Dashboard";


export default function App() {
  const MotionWrap = ({ children }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* ⭐ Fully branded first screen */}
          <Route path="/" element={<MotionWrap><LandingPage /></MotionWrap>} />

          {/* 🔹 Optional intro / mission screen */}
          <Route path="/welcome" element={<MotionWrap><WelcomePage /></MotionWrap>} />

          {/* 🔸 Main app */}
          <Route path="/dashboard" element={<MotionWrap><Dashboard /></MotionWrap>} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}
