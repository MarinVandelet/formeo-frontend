import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { confirmPayment } from "../api/payment";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const inscriptionId = searchParams.get("inscriptionId");
    if (!inscriptionId) {
      setStatus("error");
      setMessage("Identifiant d'inscription manquant.");
      return;
    }

    const run = async () => {
      try {
        await confirmPayment(inscriptionId);
        setStatus("ok");
        setMessage("Paiement confirmé ! Votre inscription est maintenant payée.");
      } catch (err) {
        console.error("Erreur confirmation paiement:", err);
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Erreur lors de la confirmation du paiement.";
        setStatus("error");
        setMessage(msg);
      }
    };

    run();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-50">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl border border-slate-200 p-8 space-y-4 text-center">
        {status === "loading" && (
          <>
            <h1 className="text-xl font-semibold mb-2">
              Confirmation du paiement...
            </h1>
            <p className="text-sm text-slate-500">
              Merci de patienter pendant la validation de votre inscription.
            </p>
          </>
        )}

        {status !== "loading" && (
          <>
            <h1 className="text-xl font-semibold mb-2">
              {status === "ok" ? "Paiement réussi" : "Problème lors du paiement"}
            </h1>
            <p
              className={`text-sm ${
                status === "ok" ? "text-green-600" : "text-red-600"
              }`}>
              {message}
            </p>
          </>
        )}

        <div className="pt-4 flex flex-col gap-2 items-center">
          <button
            onClick={() => navigate("/profil")}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm hover:bg-indigo-700">
            <span className="material-icons text-sm">person</span>
            <span>Voir mon profil</span>
          </button>
          <Link
            to="/"
            className="text-xs text-slate-500 hover:text-slate-700">
            Revenir à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
