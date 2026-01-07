import api from "./client";

export const createCheckoutSession = async (inscriptionId) => {
  const res = await api.post(`/paiement/checkout/${inscriptionId}`);
  return res.data; 
};

export const confirmPayment = async (inscriptionId) => {
  const res = await api.post(`/paiement/confirm/${inscriptionId}`);
  return res.data;
};
