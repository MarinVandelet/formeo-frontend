import React, { useEffect, useState } from "react";
import { fetchIntervenantSessions } from "../../api/sessions";
import { fetchFeuilleEmargement } from "../../api/emargements";

import {
  fetchEvaluationsBySession,
  saveEvaluationsForSession,
} from "../../api/evaluations";

const formatDateTime = (value) => {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
  });
};

const IntervenantProfile = ({ user, isAdmin = false }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ÉMARGEMENTS
  const [showModal, setShowModal] = useState(false);
  const [modalSession, setModalSession] = useState(null);
  const [modalDate, setModalDate] = useState("");
  const [modalLines, setModalLines] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  // Historique d'émargements
  const [recentSheets, setRecentSheets] = useState([]);
  const [showAllSheets, setShowAllSheets] = useState(false);

  // ÉVALUATIONS
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [evalSession, setEvalSession] = useState(null);
  const [evalLines, setEvalLines] = useState([]); // [{ inscriptionId, prenom, nom, email, note }]
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalError, setEvalError] = useState("");
  const [evalSaving, setEvalSaving] = useState(false);

  // Historique évaluations
  const [recentEvalSheets, setRecentEvalSheets] = useState([]);
  const [showAllEvalSheets, setShowAllEvalSheets] = useState(false);

  const loadSessions = async () => {
    setLoading(true);
    setError("");
    try {
      const sess = await fetchIntervenantSessions();
      setSessions(sess);
    } catch (err) {
      console.error("Erreur sessions intervenant:", err);
      setError("Impossible de charger vos sessions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // FEUILLE D'ÉMARGEMENT

  const addToRecentSheets = (session, dateStr, lines) => {
    setRecentSheets((prev) => {
      const filtered = prev.filter(
        (s) => !(s.sessionId === session.id && s.date === dateStr)
      );
      const updated = [
        {
          sessionId: session.id,
          sessionTitle: session.formation?.titre || `Session ${session.id}`,
          date: dateStr,
          lines,
          loadedAt: Date.now(),
        },
        ...filtered,
      ];
      return updated.sort((a, b) => b.loadedAt - a.loadedAt);
    });
  };

  const loadFeuille = async (session, dateStr) => {
    if (!session || !dateStr) return;
    setModalLoading(true);
    setModalError("");
    setModalLines([]);
    try {
      const data = await fetchFeuilleEmargement(session.id, dateStr);
      setModalLines(data);
      addToRecentSheets(session, dateStr, data);
    } catch (err) {
      console.error("Erreur feuille émargement:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Impossible de charger la feuille d'émargement.";
      setModalError(msg);
    } finally {
      setModalLoading(false);
    }
  };

  const openFeuilleModal = async (session) => {
    const today = new Date();
    const iso = today.toISOString().slice(0, 10);
    setModalSession(session);
    setModalDate(iso);
    setShowModal(true);
    await loadFeuille(session, iso);
  };

  const handleModalDateChange = async (e) => {
    const value = e.target.value;
    setModalDate(value);
    if (modalSession) {
      await loadFeuille(modalSession, value);
    }
  };

  const openFromHistory = (sheet) => {
    const session = sessions.find((s) => s.id === sheet.sessionId);
    if (!session) return;
    setModalSession(session);
    setModalDate(sheet.date);
    setModalLines(sheet.lines); // cache
    setShowModal(true);
    loadFeuille(session, sheet.date); // rafraîchir
  };

  const displayedSheets = showAllSheets
    ? recentSheets
    : recentSheets.slice(0, 3);

  // ÉVALUATIONS

  const addToRecentEvalSheets = (session, lines) => {
    setRecentEvalSheets((prev) => {
      const filtered = prev.filter((s) => s.sessionId !== session.id);
      const updated = [
        {
          sessionId: session.id,
          sessionTitle: session.formation?.titre || `Session ${session.id}`,
          lines,
          loadedAt: Date.now(),
        },
        ...filtered,
      ];
      return updated.sort((a, b) => b.loadedAt - a.loadedAt);
    });
  };

  const openEvalModal = async (session) => {
    setEvalSession(session);
    setEvalLines([]);
    setEvalError("");
    setEvalModalOpen(true);
    setEvalLoading(true);
    try {
      const data = await fetchEvaluationsBySession(session.id);
      setEvalLines(
        data.map((line) => ({
          ...line,
          note: line.note != null ? line.note : "",
        }))
      );
      addToRecentEvalSheets(session, data);
    } catch (err) {
      console.error("Erreur chargement évaluations:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Impossible de charger les évaluations.";
      setEvalError(msg);
    } finally {
      setEvalLoading(false);
    }
  };

  const handleEvalNoteChange = (inscriptionId, value) => {
    setEvalLines((prev) =>
      prev.map((l) =>
        l.inscriptionId === inscriptionId ? { ...l, note: value } : l
      )
    );
  };

  const handleSaveEvaluations = async () => {
    if (!evalSession) return;
    setEvalSaving(true);
    setEvalError("");
    try {
      const payload = evalLines
        .filter((l) => l.note !== "" && l.note != null)
        .map((l) => ({
          inscriptionId: l.inscriptionId,
          note: Number(l.note),
        }));
      await saveEvaluationsForSession(evalSession.id, payload);

      await openEvalModal(evalSession);
    } catch (err) {
      console.error("Erreur sauvegarde évaluations:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Impossible d'enregistrer les évaluations.";
      setEvalError(msg);
    } finally {
      setEvalSaving(false);
    }
  };

  const displayedEvalSheets = showAllEvalSheets
    ? recentEvalSheets
    : recentEvalSheets.slice(0, 3);

  // FRONT

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-900">{user.email}</p>
          <p className="text-xs text-slate-500">
            Rôle : <span className="font-medium">{user.role}</span>
          </p>
        </div>
        <p className="text-xs text-slate-400 text-right">
          {isAdmin
            ? "Espace admin : visualisez les sessions, les feuilles d'émargement et les évaluations."
            : "Espace intervenant : visualisez vos sessions, les feuilles d'émargement et les évaluations."}
        </p>
      </div>

      {loading && (
        <p className="text-sm text-slate-500">Chargement de vos sessions...</p>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          {isAdmin ? "Sessions gérées" : "Mes sessions en tant qu'intervenant"}
        </h2>

        {!loading && sessions.length === 0 && (
          <p className="text-sm text-slate-500">
            Aucune session ne vous est encore assignée.
          </p>
        )}

        <div className="space-y-3">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-900">
                  {s.formation?.titre || `Session ${s.id}`}
                </p>
                <p className="text-xs text-slate-500">
                  Session #{s.id} – {formatDateTime(s.dateDebut)} →{" "}
                  {formatDateTime(s.dateFin)}
                </p>
                <p className="text-xs text-slate-500">
                  Lieu :{" "}
                  {s.ville
                    ? `${s.ville}${s.salle ? " – " + s.salle : ""}`
                    : "Non renseigné"}
                </p>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <button
                  onClick={() => openFeuilleModal(s)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs hover:bg-slate-200"
                >
                  <span className="material-icons text-xs">fact_check</span>
                  <span>Feuille d&apos;émargement</span>
                </button>
                <button
                  onClick={() => openEvalModal(s)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs hover:bg-indigo-700"
                >
                  <span className="material-icons text-xs">grading</span>
                  <span>Évaluations</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {recentSheets.length > 0 && (
        <section className="space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Dernières feuilles d&apos;émargement consultées
            </h2>
            {recentSheets.length > 3 && (
              <button
                className="text-xs text-indigo-600 hover:underline"
                onClick={() => setShowAllSheets((v) => !v)}
              >
                {showAllSheets ? "Voir moins" : "Voir plus"}
              </button>
            )}
          </div>

          <div className="space-y-2">
            {displayedSheets.map((sheet) => {
              const presents = sheet.lines.filter((l) => l.present).length;
              const total = sheet.lines.length;
              return (
                <button
                  key={`${sheet.sessionId}-${sheet.date}`}
                  onClick={() => openFromHistory(sheet)}
                  className="w-full text-left bg-white border border-slate-200 rounded-lg p-3 hover:border-indigo-400 hover:shadow-sm transition flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {sheet.sessionTitle} – Session #{sheet.sessionId}
                    </p>
                    <p className="text-xs text-slate-500">
                      Jour de cours : {formatDate(sheet.date)}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600">
                    Présents :{" "}
                    <span className="font-semibold">
                      {presents} / {total}
                    </span>
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {recentEvalSheets.length > 0 && (
        <section className="space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Dernières feuilles d&apos;évaluation consultées
            </h2>
            {recentEvalSheets.length > 3 && (
              <button
                className="text-xs text-indigo-600 hover:underline"
                onClick={() => setShowAllEvalSheets((v) => !v)}
              >
                {showAllEvalSheets ? "Voir moins" : "Voir plus"}
              </button>
            )}
          </div>

          <div className="space-y-2">
            {displayedEvalSheets.map((sheet) => {
              const notés = sheet.lines.filter(
                (l) => l.note != null && l.note !== ""
              ).length;
              const total = sheet.lines.length;
              return (
                <button
                  key={sheet.sessionId}
                  onClick={() => {
                    const session = sessions.find(
                      (s) => s.id === sheet.sessionId
                    );
                    if (session) openEvalModal(session);
                  }}
                  className="w-full text-left bg-white border border-slate-200 rounded-lg p-3 hover:border-indigo-400 hover:shadow-sm transition flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {sheet.sessionTitle} – Session #{sheet.sessionId}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600">
                    Apprenants notés :{" "}
                    <span className="font-semibold">
                      {notés} / {total}
                    </span>
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {showModal && modalSession && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-30">
          <div className="bg-white max-w-2xl w-full mx-4 rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-start gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Feuille d&apos;émargement
                </h2>
                <p className="text-xs text-slate-500">
                  {modalSession.formation?.titre ||
                    `Session ${modalSession.id}`}{" "}
                  – Session #{modalSession.id}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-icons text-xl">close</span>
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <p className="text-xs text-slate-500">
                Période : {formatDate(modalSession.dateDebut)} →{" "}
                {formatDate(modalSession.dateFin)} – Lundi au vendredi, 8h–18h
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-600">Jour de cours :</span>
                <input
                  type="date"
                  className="border border-slate-300 rounded-md px-2 py-1 text-xs"
                  value={modalDate}
                  onChange={handleModalDateChange}
                />
              </div>
            </div>

            {modalError && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {modalError}
              </div>
            )}

            {modalLoading ? (
              <p className="text-xs text-slate-500">
                Chargement de la feuille d&apos;émargement...
              </p>
            ) : modalLines.length === 0 ? (
              <p className="text-xs text-slate-500">
                Aucun inscrit payé pour cette session ou aucune donnée
                d&apos;émargement pour ce jour.
              </p>
            ) : (
              <div className="max-h-72 overflow-y-auto border border-slate-100 rounded-md">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-slate-600">
                        Élève
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-slate-600">
                        Email
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-slate-600">
                        Statut
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-slate-600">
                        Heure d&apos;émargement
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalLines.map((l) => (
                      <tr key={l.utilisateurId} className="border-t">
                        <td className="px-3 py-1.5">
                          {l.prenom} {l.nom}
                        </td>
                        <td className="px-3 py-1.5">{l.email}</td>
                        <td className="px-3 py-1.5">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[11px] ${
                              l.present
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {l.present ? "Présent" : "Absent"}
                          </span>
                        </td>
                        <td className="px-3 py-1.5">
                          {l.dateHeureEmargement
                            ? new Date(
                                l.dateHeureEmargement
                              ).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="text-[11px] text-slate-400">
              Seuls les jours de cours (lundi à vendredi) compris dans la
              période de la session sont autorisés pour l&apos;émargement.
            </p>
          </div>
        </div>
      )}

      {evalModalOpen && evalSession && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white max-w-2xl w-full mx-4 rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-start gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Évaluations – Session #{evalSession.id}
                </h2>
                <p className="text-xs text-slate-500">
                  {evalSession.formation?.titre || "Formation"}
                </p>
              </div>
              <button
                onClick={() => setEvalModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-icons text-xl">close</span>
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Saisissez une note sur 20 pour chaque participant (une seule
              évaluation par session et par élève). Une note &gt;= 10 génère une
              attestation de succès, sinon une attestation de présence.
            </p>

            {evalError && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {evalError}
              </div>
            )}

            {evalLoading ? (
              <p className="text-xs text-slate-500">
                Chargement des évaluations...
              </p>
            ) : evalLines.length === 0 ? (
              <p className="text-xs text-slate-500">
                Aucun inscrit payé pour cette session.
              </p>
            ) : (
              <div className="max-h-72 overflow-y-auto border border-slate-100 rounded-md">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Élève</th>
                      <th className="px-3 py-2 text-left">Email</th>
                      <th className="px-3 py-2 text-left">Note / 20</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evalLines.map((l) => (
                      <tr key={l.inscriptionId} className="border-t">
                        <td className="px-3 py-1.5">
                          {l.prenom} {l.nom}
                        </td>
                        <td className="px-3 py-1.5">{l.email}</td>
                        <td className="px-3 py-1.5">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.5"
                            className="w-20 border border-slate-300 rounded-md px-1 py-0.5 text-xs"
                            value={l.note}
                            onChange={(e) =>
                              handleEvalNoteChange(
                                l.inscriptionId,
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEvalModalOpen(false)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-full hover:bg-slate-100"
              >
                Fermer
              </button>
              <button
                onClick={handleSaveEvaluations}
                disabled={evalSaving || evalLoading || evalLines.length === 0}
                className="px-3 py-1.5 text-xs rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {evalSaving ? "Enregistrement..." : "Enregistrer les notes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntervenantProfile;