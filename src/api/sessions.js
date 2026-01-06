import api from "./client";

export const fetchSessions = async ({ formationId } = {}) => {
  const res = await api.get("/sessions", {
    params: formationId ? { formationId } : {},
  });
  return res.data;
};

export const fetchIntervenantSessions = async () => {
  const res = await api.get("/sessions/mes-sessions");
  return res.data;
};

export const createSession = async (payload) => {
  const res = await api.post("/sessions", payload);
  return res.data;
};

export const updateSession = async (id, payload) => {
  const res = await api.put(`/sessions/${id}`, payload);
  return res.data;
};

export const deleteSession = async (id) => {
  await api.delete(`/sessions/${id}`);
};
