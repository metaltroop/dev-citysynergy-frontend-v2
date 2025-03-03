import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const refreshAccessToken = async () => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh-token`, 
            {}, 
            { withCredentials: true }
        );
        
        if (response.data.success) {
            const { accessToken } = response.data.data;
            localStorage.setItem('token', accessToken);
            return accessToken;
        } else {
            throw new Error('Token refresh failed');
        }
    } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        window.location.href = '/login';
        throw error;
    }
};

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
});

apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

apiClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;