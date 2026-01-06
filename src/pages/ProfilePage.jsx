import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchMe } from "../api/auth";
import StudentProfile from "../components/profile/StudentProfile.jsx";
import IntervenantProfile from "../components/profile/IntervenantProfile.jsx";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const me = await fetchMe();
        setUser(me);
      } catch (err) {
        console.error("Erreur fetchMe:", err);
        setError("Impossible de charger votre profil.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <p className="text-sm text-slate-500">Chargement du profil...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <p className="text-sm text-red-600">{error || "Profil introuvable."}</p>
      </div>
    );
  }

  // 👉 Un admin est redirigé vers le dashboard
  if (user.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  if (user.role === "USER") {
    return <StudentProfile user={user} />;
  }

  if (user.role === "INTERVENANT") {
    return <IntervenantProfile user={user} isAdmin={false} />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <p className="text-sm">
        Rôle <span className="font-mono">{user.role}</span> non géré pour le
        moment.
      </p>
    </div>
  );
};

export default ProfilePage;
