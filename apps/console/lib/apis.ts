import axios, { AxiosInstance } from 'axios';
import Cookies from "js-cookie";

const token = Cookies.get("token");
const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://api.credora.tech';


export const FileApi = axios.create({
  baseURL: `${API_URL}/api/file`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});
export const AuthApi = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ApiInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});



const addAuthInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = Cookies.get("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};


addAuthInterceptor(ApiInstance);
addAuthInterceptor(FileApi);