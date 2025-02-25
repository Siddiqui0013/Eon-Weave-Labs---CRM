import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: 'http://localhost:8000/api',
    baseURL: 'https://ewlcrm-backend.vercel.app/api',
    withCredentials: true,
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
    });

export default axiosInstance;