import api from "./client";

export const fetchFormations = async () => {
  const res = await api.get("/api/formations");
  return res.data;
};

export const fetchFormationsByCategorie = async (categorieId) => {
  const res = await api.get(`/api/formations`, {
    params: { categorieId },
  });
  return res.data;
};

export const createFormation = async (payload) => {
  const res = await api.post("/api/formations", payload);
  return res.data;
};

export const updateFormation = async (id, payload) => {
  const res = await api.put(`/api/formations/${id}`, payload);
  return res.data;
};

export const deleteFormation = async (id) => {
  await api.delete(`/api/formations/${id}`);
};
