import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchSessions } from "../api/sessions";
import { createInscription } from "../api/inscriptions";

const formatDateTime = (value) => {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleString("fr-FR", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const FormationSessionsPage = () => {
  const { id: formationId } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    setSuccess("");
    setShowModal(false);

    fetchSessions({ formationId })
      .then((data) => {
        if (mounted) {
          setSessions(data);
        }
      })
      .catch((err) => {
        console.error("Erreur fetchSessions:", err);
        setError("Impossible de charger les sessions.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [formationId]);

  const handleInscription = async (sessionId) => {
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vous devez être connecté pour vous inscrire.");
      return;
    }

    try {
      await createInscription(sessionId);
      setSuccess("Inscription enregistrée !");
      setShowModal(true);
    } catch (err) {
      console.error("Erreur inscription:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Impossible de créer l'inscription.";
      setError(msg);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between gap-4 mb-2">
        <h1 className="text-xl font-semibold">
          Sessions pour la formation #{formationId}
        </h1>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1">
            <span className="material-icons text-xs">home</span>
            Accueil
          </Link>
          <Link
            to={-1}
            className="text-xs text-slate-500 hover:underline inline-flex items-center gap-1">
            <span className="material-icons text-xs">arrow_back</span>
            Retour
          </Link>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-slate-500">Chargement des sessions...</p>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {success && !showModal && (
        <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          {success}
        </div>
      )}

      {!loading && !error && sessions.length === 0 && (
        <p className="text-sm text-slate-500">
          Aucune session disponible pour cette formation pour le moment.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
            <h2 className="font-medium text-slate-900">
              {s.formation?.titre || `Session ${s.id}`}
            </h2>
            <p className="text-xs text-slate-500">
              Du {formatDateTime(s.dateDebut)} au {formatDateTime(s.dateFin)}
            </p>
            <p className="text-xs text-slate-500">
              Lieu :{" "}
              {s.ville
                ? `${s.ville}${s.salle ? " – " + s.salle : ""}`
                : "Non renseigné"}
            </p>
            <p className="text-xs text-slate-500">
              Capacité : {s.capacite} personnes
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleInscription(s.id)}
                className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <span className="material-icons text-xs">how_to_reg</span>
                <span>S&apos;inscrire</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* le popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-30">
          <div className="bg-white max-w-sm w-full mx-4 rounded-2xl shadow-lg border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Inscription en attente de paiement
            </h2>
            <p className="text-sm text-slate-600">
              Votre inscription a bien été enregistrée et est actuellement{" "}
              <span className="font-semibold">en attente</span>.  
              Rendez-vous dans votre profil pour régler la formation.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 text-xs rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100">
                Fermer
              </button>
              <button
                onClick={() => navigate("/profil")}
                className="px-3 py-1.5 text-xs rounded-full bg-indigo-600 text-white hover:bg-indigo-700 inline-flex items-center gap-1">
                <span className="material-icons text-xs">person</span>
                <span>Aller à mon profil</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormationSessionsPage;
