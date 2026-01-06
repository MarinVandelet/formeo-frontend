import api from "./client";

export const registerUser = async (payload) => {
  const res = await api.post("/auth/register", payload);
  return res.data;
};

export const loginUser = async (payload) => {
  const res = await api.post("/auth/login", payload);
  return res.data;
};

export const fetchMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};
