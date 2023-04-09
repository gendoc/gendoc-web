import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_BASE_URL,
    withCredentials: true,
    headers:{
        withCredentials: true,
    }
});

export default axiosInstance;