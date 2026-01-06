import api from "./client";

// Télécharge l'attestation (succès ou présence) liée à une inscription.
// Le backend décide du type en fonction de la note (>=10 : succès, sinon présence).
export const downloadAttestation = async (inscriptionId) => {
  const response = await api.get(`/api/attestations/${inscriptionId}`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `attestation_${inscriptionId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};
