import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://assignment11-lemon.vercel.app",
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
