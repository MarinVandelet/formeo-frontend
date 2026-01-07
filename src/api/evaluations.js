import api from "./client";

export const fetchEvaluationsBySession = async (sessionId) => {
  const res = await api.get(`/evaluations/session/${sessionId}`);
  return res.data;
};

export const saveEvaluationsForSession = async (sessionId, evaluations) => {
  const res = await api.post(
    `/evaluations/session/${sessionId}`,
    evaluations
  );
  return res.data;
};
