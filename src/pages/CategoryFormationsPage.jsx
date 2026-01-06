import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchFormationsByCategorie } from "../api/formations";

const CategoryFormationsPage = () => {
  const { id } = useParams(); // id de la catégorie
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchFormationsByCategorie(id)
      .then((data) => {
        if (mounted) {
          setFormations(data);
          setError(false);
        }
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="text-xl font-semibold">
          Formations de la catégorie #{id}
        </h1>
        <Link
          to="/"
          className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1"
        >
          <span className="material-icons text-xs">arrow_back</span>
          Retour à l'accueil
        </Link>
      </div>

      {loading && (
        <p className="text-sm text-slate-500">Chargement des formations...</p>
      )}

      {error && (
        <p className="text-sm text-red-500">
          Impossible de charger les formations.
        </p>
      )}

      {!loading && !error && formations.length === 0 && (
        <p className="text-sm text-slate-500">
          Aucune formation trouvée pour cette catégorie.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formations.map((f) => (
          <div
            key={f.id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3"
          >
            <h2 className="font-medium text-slate-900">{f.titre}</h2>
            <p className="text-xs text-slate-500">
              {f.description || "Pas de description."}
            </p>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Durée : {f.dureeJours} jours</span>
              {f.prix != null && (
                <span className="font-semibold text-indigo-600">
                  {Number(f.prix).toFixed(2)} €
                </span>
              )}
            </div>
            {f.intervenantNom && (
              <p className="text-xs text-slate-500">
                Intervenant : {f.intervenantPrenom} {f.intervenantNom}
              </p>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => navigate(`/formations/${f.id}/sessions`)}
                className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <span className="material-icons text-xs">event</span>
                <span>Voir les sessions</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFormationsPage;
