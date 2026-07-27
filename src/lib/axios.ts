import axios from "axios";
import { getAccessToken } from "./auth/token";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api-educon-partner.jdbe5dance.com";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
