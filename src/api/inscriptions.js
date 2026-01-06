import api from "./client";

export const createInscription = async (sessionId) => {
  const res = await api.post("/inscriptions", { sessionId });
  return res.data;
};

export const fetchMyInscriptions = async () => {
  const res = await api.get("/inscriptions/me");
  return res.data;
};

// "Paiement" d'une inscription (appelera l'endpoint de paiement / validation)
export const payInscription = async (inscriptionId) => {
  const res = await api.post(`/inscriptions/${inscriptionId}/payer`);
  return res.data;
};
