import { BACKEND_URL } from '@/config/enviroment.config';
import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}\\api\\v1`,
  withCredentials: true,
  timeout: 1500,
});

export { axiosInstance };
