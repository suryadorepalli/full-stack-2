import axios from "axios";
import { refreshAccessToken, isTokenExpired } from "./auth";
const api = axios.create({ baseURL: "https://jsonplaceholder.typicode.com", timeout: 10000, headers: { "Content-Type": "application/json" } });
api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("accessToken");
  if (token) {
    if (isTokenExpired(token)) {
      const newToken = await refreshAccessToken();
      if (newToken) { localStorage.setItem("accessToken", newToken); token = newToken; }
      else {
        localStorage.removeItem("accessToken"); localStorage.removeItem("refreshToken"); localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(new Error("Session expired"));
      }
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));
api.interceptors.response.use((response) => response, (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 401: alert("Unauthorized! Please login again."); window.location.href = "/login"; break;
      case 403: alert("Access Denied."); break;
      case 404: console.log("Requested resource not found."); break;
      case 500: console.log("Internal Server Error."); break;
      default: console.log(error.response.data);
    }
  } else if (error.request) console.log("Network Error");
  else console.log(error.message);
  return Promise.reject(error);
});
export const getData = async (url) => (await api.get(url)).data;
export const postData = async (url, data) => (await api.post(url, data)).data;
export const putData = async (url, data) => (await api.put(url, data)).data;
export const deleteData = async (url) => (await api.delete(url)).data;
export default api;
