import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchMe } from "../api/auth";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);

    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    fetchMe()
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const isAdmin = user?.role === "ADMIN";

  const displayUser = useMemo(() => {
    if (!user) return "Visiteur";
    return `Connecté : ${user.email} (${user.role})`;
  }, [user]);

  const isHome = location.pathname === "/";

  // 🔽 Scroll top helper
  const goHome = () => {
    if (isHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 0);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur border-b border-slate-200 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LOGO (comme avant) */}
        <button
          onClick={goHome}
          className="flex items-center gap-2 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
            F
          </div>
          <span className="font-bold text-xl tracking-tight">Formeo</span>
        </button>

        {/* Liens centre */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#categories" className="hover:text-indigo-600">
            Catégories
          </a>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-400">{displayUser}</span>
        </nav>

        {/* Zone droite */}
        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={() =>
                isAdmin ? navigate("/admin") : navigate("/profil")
              }
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-300 text-sm hover:bg-slate-100"
            >
              <span className="material-icons text-base">
                {isAdmin ? "dashboard" : "person"}
              </span>
              <span>{isAdmin ? "Dashboard" : "Profil"}</span>
            </button>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm hover:bg-slate-200"
            >
              <span className="material-icons text-base">logout</span>
              <span>Déconnexion</span>
            </button>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
            >
              <span className="material-icons text-base">person</span>
              <span>Connexion</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
