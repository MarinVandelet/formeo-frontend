import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyInscriptions } from "../../api/inscriptions";
import { createCheckoutSession } from "../../api/payment";
import {
  fetchMyEmargements,
  pointerEmargement,
} from "../../api/emargements";
import { downloadAttestation } from "../../api/attestations";
import SignatureCanvas from "react-signature-canvas";

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

const statusLabel = (statut) => {
  switch (statut) {
    case "PAYEE":
      return "Payée";
    case "EN_ATTENTE":
      return "En attente de paiement";
    case "ANNULEE":
      return "Annulée";
    default:
      return statut;
  }
};

const statusClass = (statut) => {
  switch (statut) {
    case "PAYEE":
      return "bg-green-100 text-green-700";
    case "EN_ATTENTE":
      return "bg-amber-100 text-amber-700";
    case "ANNULEE":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const getAttestationType = (note) => {
  if (note == null) return null;
  return note >= 10 ? "SUCCES" : "PRESENCE";
};

const attestationLabel = (type) => {
  if (!type) return "";
  return type === "SUCCES" ? "Attestation de succès" : "Attestation de présence";
};

const StudentProfile = ({ user }) => {
  const navigate = useNavigate();

  const [inscriptions, setInscriptions] = useState([]);
  const [emargements, setEmargements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Signature 
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [signSessionId, setSignSessionId] = useState(null);
  const [signLoading, setSignLoading] = useState(false);
  const [signError, setSignError] = useState("");
  const sigCanvasRef = useRef(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const [listIns, listEm] = await Promise.all([
        fetchMyInscriptions(),
        fetchMyEmargements(),
      ]);
      setInscriptions(listIns);
      setEmargements(listEm);
    } catch (err) {
      console.error("Erreur profil élève:", err);
      setError("Impossible de charger vos informations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePay = async (id) => {
    setError("");
    setMessage("");
    try {
      const { url } = await createCheckoutSession(id);
      if (!url) {
        throw new Error("Pas d'URL Stripe reçue");
      }
      window.location.href = url;
    } catch (err) {
      console.error("Erreur création session Stripe:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Impossible de démarrer le paiement.";
      setError(msg);
    }
  };

  const openSignModal = (sessionId) => {
    setSignSessionId(sessionId);
    setSignError("");
    setSignModalOpen(true);
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
    }
  };

  const closeSignModal = () => {
    setSignModalOpen(false);
    setSignSessionId(null);
    setSignError("");
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
    }
  };

  const handleConfirmSignature = async () => {
    if (!signSessionId || !sigCanvasRef.current) return;

    if (sigCanvasRef.current.isEmpty()) {
      setSignError("Veuillez signer dans le cadre avant de valider.");
      return;
    }

    setSignLoading(true);
    setSignError("");
    setError("");
    setMessage("");

    try {
      const dataUrl = sigCanvasRef.current.toDataURL("image/png");
      await pointerEmargement(signSessionId, dataUrl);
      setMessage("Émargement enregistré avec votre signature.");
      closeSignModal();
      await loadData();
    } catch (err) {
      console.error("Erreur émargement:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Impossible d'enregistrer l'émargement.";
      setError(msg);
    } finally {
      setSignLoading(false);
    }
  };

  const handleDownloadAttestation = async (inscriptionId) => {
    setError("");
    setMessage("");
    try {
      await downloadAttestation(inscriptionId);
    } catch (err) {
      console.error("Erreur téléchargement attestation:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Impossible de télécharger l'attestation.";
      setError(msg);
    }
  };

  const inscriptionsAvecNote = inscriptions.filter((ins) => ins.note != null);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-900">{user.email}</p>
          <p className="text-xs text-slate-500">
            Rôle : <span className="font-medium">{user.role}</span>
          </p>
        </div>
        <p className="text-xs text-slate-400 text-right">
          Ici vous gérez vos inscriptions, paiements, émargements et
          attestations.
        </p>
      </div>

      {loading && (
        <p className="text-sm text-slate-500">Chargement de vos données...</p>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {message && (
        <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          {message}
        </div>
      )}

      {/* inscriptions */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Mes inscriptions</h2>

        {!loading && inscriptions.length === 0 && (
          <p className="text-sm text-slate-500">
            Vous n&apos;avez encore aucune inscription.
          </p>
        )}

        <div className="space-y-3">
          {inscriptions.map((ins) => (
            <div
              key={ins.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-900">
                  {ins.session?.formation?.titre || "Formation"}
                </p>
                <p className="text-xs text-slate-500">
                  Session #{ins.session?.id} –{" "}
                  {formatDateTime(ins.session?.dateDebut)} →{" "}
                  {formatDateTime(ins.session?.dateFin)}
                </p>
                <p className="text-xs text-slate-500">
                  Lieu :{" "}
                  {ins.session?.ville
                    ? `${ins.session.ville}${
                        ins.session.salle ? " – " + ins.session.salle : ""
                      }`
                    : "Non renseigné"}
                </p>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClass(
                    ins.statut
                  )}`}
                >
                  {statusLabel(ins.statut)}
                </span>
                {ins.note != null && (
                  <p className="text-[11px] text-slate-500">
                    Note obtenue :{" "}
                    <span className="font-semibold">{ins.note} / 20</span>
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-2 md:mt-0 md:flex-col md:items-end">
                {ins.statut === "EN_ATTENTE" && (
                  <button
                    onClick={() => handlePay(ins.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs hover:bg-indigo-700"
                  >
                    <span className="material-icons text-xs">credit_card</span>
                    <span>Payer (Stripe)</span>
                  </button>
                )}

                {ins.statut === "PAYEE" && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/salle/${ins.session.id}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs hover:bg-slate-800"
                      title="Accéder à la salle 3D">
                      <span className="material-icons text-xs">view_in_ar</span>
                      <span>Salle 3D</span>
                    </button>

                    <button
                      onClick={() => openSignModal(ins.session.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                      title="Émarger aujourd'hui">
                      <span className="material-icons text-xs">draw</span>
                      <span>Émarger</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* les emargements */}
      <section className="space-y-3 mt-6">
        <h2 className="text-lg font-semibold">Mes émargements</h2>

        {!loading && emargements.length === 0 && (
          <p className="text-sm text-slate-500">
            Vous n&apos;avez pas encore émargé de journée de cours.
          </p>
        )}

        <div className="space-y-2">
          {emargements.map((e) => (
            <div
              key={e.id}
              className="bg-white border border-slate-100 rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {e.formationTitre || "Formation"} – Session #{e.sessionId}
                </p>
                <p className="text-xs text-slate-500">
                  Jour de cours : {formatDate(e.jourCours)}
                </p>
              </div>
              <p className="text-xs text-slate-500">
                Émargé le {formatDateTime(e.dateHeureEmargement)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* les attestations */}
      <section className="space-y-3 mt-6">
        <h2 className="text-lg font-semibold">Mes attestations</h2>

        {!loading && inscriptionsAvecNote.length === 0 && (
          <p className="text-sm text-slate-500">
            Vous n&apos;avez pas encore d&apos;attestation (aucune évaluation
            enregistrée).
          </p>
        )}

        <div className="space-y-3">
          {inscriptionsAvecNote.map((ins) => {
            const type = getAttestationType(ins.note);
            return (
              <div
                key={ins.id}
                className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900">
                    {ins.session?.formation?.titre || "Formation"} – Session #
                    {ins.session?.id}
                  </p>
                  <p className="text-xs text-slate-500">
                    Note obtenue :{" "}
                    <span className="font-semibold">{ins.note} / 20</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    Type :{" "}
                    <span className="font-semibold">
                      {attestationLabel(type)}
                    </span>
                  </p>
                  {ins.dateEvaluation && (
                    <p className="text-[11px] text-slate-400">
                      Évalué le {formatDateTime(ins.dateEvaluation)}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleDownloadAttestation(ins.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs hover:bg-indigo-700">
                    <span className="material-icons text-xs">picture_as_pdf</span>
                    <span>Télécharger le PDF</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* signature */}
      {signModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
          <div className="bg-white max-w-lg w-full mx-4 rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-start gap-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Signature d&apos;émargement
              </h2>
              <button
                onClick={closeSignModal}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-icons text-xl">close</span>
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Merci de signer ci-dessous pour confirmer votre présence à la
              journée de cours.
            </p>

            <div className="border border-slate-300 rounded-lg bg-slate-50">
              <SignatureCanvas
                ref={sigCanvasRef}
                canvasProps={{
                  className: "w-full h-40 rounded-lg",
                }}
              />
            </div>

            {signError && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {signError}
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() =>
                  sigCanvasRef.current && sigCanvasRef.current.clear()
                }
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-full hover:bg-slate-100">
                Effacer
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={closeSignModal}
                  className="px-3 py-1.5 text-xs border border-slate-300 rounded-full hover:bg-slate-100">
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSignature}
                  disabled={signLoading}
                  className="px-3 py-1.5 text-xs rounded-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  {signLoading ? "Enregistrement..." : "Valider ma signature"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
