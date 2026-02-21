import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: baseURL ?? "http://localhost:5002",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error(err);
    return Promise.reject(err);
  },
);
