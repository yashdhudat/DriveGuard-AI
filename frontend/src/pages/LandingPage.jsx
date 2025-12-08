import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeroCar from "../assets/landing/hero-car.png";
import BgGrid from "../assets/landing/background-grid.png";

export default function LandingPage() {
  return (
    <div
      className="min-h-screen w-full bg-[#050814] text-white relative overflow-hidden"
      style={{
        backgroundImage: `url(${BgGrid})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050814]/60 to-[#000]/95"></div>

      {/* HERO SECTION */}
      <div className="relative z-10 flex flex-col items-center text-center pt-24 px-6">

        {/* Title */}
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          DriveGuard AI
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="max-w-3xl mt-4 text-lg text-slate-300 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          AI-Powered Predictive Maintenance for Safer Vehicles. Prevent breakdowns before they happen.
        </motion.p>

        {/* 🔥 Floating Car with Neon Pulse */}
        <motion.div
          className="w-full max-w-2xl mt-10"
          animate={{
            y: [0, -12, 0],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 4,
            ease: "easeInOut",
          }}
        >
          <motion.img
            src={HeroCar}
            alt="AI Car Protection"
            className="w-full mx-auto rounded-2xl object-cover"
            style={{ maxHeight: "360px" }}
            animate={{
              filter: [
                "drop-shadow(0px 0px 12px #00eaff)",
                "drop-shadow(0px 0px 22px #00eaff)",
                "drop-shadow(0px 0px 12px #00eaff)",
              ],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </motion.div>

        {/* Launch Button */}
        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Link
            to="/dashboard"
            className="px-8 py-3 bg-gradient-to-r from-[#0078ff] to-[#00d4ff]
            text-white font-bold text-lg
            rounded-xl shadow-lg shadow-cyan-500/40
            hover:shadow-cyan-400/60 hover:scale-110
            transition-all duration-300
            drop-shadow-[0_0_6px_#00eaff]"
            >
            🚀 Launch Dashboard
          </Link>
        </motion.div>

        {/* Scroll Arrow Animation */}
        <motion.div
          className="absolute bottom-40 text-cyan-300 text-3xl animate-bounce"
          animate={{ opacity: [0.4, 1, 0.4], y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          ↓
        </motion.div>
      </div>

      {/* WHY SECTION */}
      <motion.div
        className="relative z-10 mt-32 px-8 md:px-20 pb-24 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-10">
          Why DriveGuard AI?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Predict Failures Early",
              desc: "Identify issues before they cause breakdowns",
            },
            {
              title: "Reduce Maintenance Cost",
              desc: "Optimize service schedules using AI analytics",
            },
            {
              title: "Boost Vehicle Safety",
              desc: "Prevent damage to critical components",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-[#0d1326] border border-cyan-600/30 rounded-xl p-5 shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.p
        className="absolute bottom-6 w-full text-center text-slate-500 text-xs tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Built for EY Techathon — Transforming Predictive Maintenance
      </motion.p>
    </div>
  );
}
