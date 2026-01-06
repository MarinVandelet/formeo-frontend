import api from "./client";

// Récupérer la "feuille d'évaluation" d'une session
// -> [{ inscriptionId, utilisateurId, prenom, nom, email, note, dateEvaluation }]
export const fetchEvaluationsBySession = async (sessionId) => {
  const res = await api.get(`/evaluations/session/${sessionId}`);
  return res.data;
};

// Enregistrer les notes pour une session
// evaluations = [{ inscriptionId, note }]
export const saveEvaluationsForSession = async (sessionId, evaluations) => {
  const res = await api.post(
    `/evaluations/session/${sessionId}`,
    evaluations
  );
  return res.data;
};
