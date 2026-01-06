import api from "./client";

// crée une session Stripe Checkout
export const createCheckoutSession = async (inscriptionId) => {
  const res = await api.post(`/paiement/checkout/${inscriptionId}`);
  return res.data; // { sessionId, url }
};

// confirme côté back (passe l'inscription à PAYEE)
export const confirmPayment = async (inscriptionId) => {
  const res = await api.post(`/paiement/confirm/${inscriptionId}`);
  return res.data;
};
