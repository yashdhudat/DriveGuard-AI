import { Link } from "react-router-dom";


export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#050A16] text-white flex items-center justify-center p-6 relative overflow-hidden">

      {/* NEON GRID */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_#00f2ff44,_transparent_70%)] opacity-60"></div>
      <div className="absolute bottom-0 w-full h-40 bg-[linear-gradient(#00e1ff33_1px,transparent_1px)] bg-[size:100px_40px] opacity-30"></div>

      {/* CONTENT */}
      <div className="relative z-10 text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-wider">
          <span className="text-cyan-400">DriveGuard AI</span>
        </h1>

        <p className="text-lg text-yellow-400 font-semibold">
          Intelligence That Protects
        </p>

        {/* Animated Bike Silhouette */}
        <div className="w-full flex justify-center">
            <img 
                src="https://cdn-icons-png.flaticon.com/512/2300/2300349.png"
                alt="Bike Silhouette"
                className="w-80 drop-shadow-[0_0_30px_#00eaff] opacity-90 animate-float"
            />


        </div>

        <p className="text-slate-300 max-w-xl mx-auto text-sm">
          Real-time predictive maintenance for 2-wheeler fleets —
          preventing breakdowns before they happen.
        </p>

        <Link
            to="/dashboard"
            className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-xl text-lg font-semibold shadow-lg hover:scale-105 duration-300"
            >
            Enter Dashboard →
        </Link>

      </div>

    </div>
  );
}
