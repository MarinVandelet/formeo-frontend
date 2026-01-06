import api from "./client";

// élève : émarger avec signature
export const pointerEmargement = async (sessionId, signatureBase64) => {
  const res = await api.post("/api/emargements", { sessionId, signatureBase64 });
  return res.data;
};

export const fetchMyEmargements = async () => {
  const res = await api.get("/api/emargements/me");
  return res.data;
};

// intervenant / admin
export const fetchFeuilleEmargement = async (sessionId, jourCours) => {
  const res = await api.get(
    `/api/emargements/session/${sessionId}/jour/${jourCours}`
  );
  return res.data;
};
