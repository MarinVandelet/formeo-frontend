import api from "./client";

// élève : émarger avec signature
export const pointerEmargement = async (sessionId, signatureBase64) => {
  const res = await api.post("/emargements", { sessionId, signatureBase64 });
  return res.data;
};

export const fetchMyEmargements = async () => {
  const res = await api.get("/emargements/me");
  return res.data;
};

// intervenant / admin
export const fetchFeuilleEmargement = async (sessionId, jourCours) => {
  const res = await api.get(
    `/emargements/session/${sessionId}/jour/${jourCours}`
  );
  return res.data;
};
