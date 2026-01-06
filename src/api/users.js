import api from "./client";

// NOTE : adapte si besoin aux champs attendus par ton UtilisateurController

export const fetchUsers = async () => {
  const res = await api.get("/utilisateurs");
  return res.data;
};

export const createUser = async (payload) => {
  const res = await api.post("/utilisateurs", payload);
  return res.data;
};

export const updateUser = async (id, payload) => {
  const res = await api.put(`/utilisateurs/${id}`, payload);
  return res.data;
};

export const deleteUser = async (id) => {
  await api.delete(`/utilisateurs/${id}`);
};
