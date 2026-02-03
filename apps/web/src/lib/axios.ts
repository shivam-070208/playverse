import { BACKEND_URL } from '@/config/enviroment.config';
import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 1500,
});

export { axiosInstance };
