import api from "./client";

export const downloadAttestation = async (inscriptionId) => {
  const response = await api.get(`/attestations/${inscriptionId}`, {
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
