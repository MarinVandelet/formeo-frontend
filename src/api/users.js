import api from "./client";

// NOTE : adapte si besoin aux champs attendus par ton UtilisateurController

export const fetchUsers = async () => {
  const res = await api.get("/api/utilisateurs");
  return res.data;
};

export const createUser = async (payload) => {
  const res = await api.post("/api/utilisateurs", payload);
  return res.data;
};

export const updateUser = async (id, payload) => {
  const res = await api.put(`/api/utilisateurs/${id}`, payload);
  return res.data;
};

export const deleteUser = async (id) => {
  await api.delete(`/api/utilisateurs/${id}`);
};
