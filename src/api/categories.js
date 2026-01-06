import api from "./client";

export const fetchCategories = async () => {
  const res = await api.get("/api/categories");
  return res.data;
};

export const createCategory = async (payload) => {
  const res = await api.post("/api/categories", payload);
  return res.data;
};

export const updateCategory = async (id, payload) => {
  const res = await api.put(`/api/categories/${id}`, payload);
  return res.data;
};

export const deleteCategory = async (id) => {
  await api.delete(`/api/categories/${id}`);
};
