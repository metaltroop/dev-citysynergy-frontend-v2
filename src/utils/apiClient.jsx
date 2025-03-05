import axios from 'axios';

const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/`,
    withCredentials: true
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const handleAuthError = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userData');
    
    isRefreshing = false;
    processQueue(new Error('Auth error'));
    
    // Use window.location.href for more reliable redirect
    window.location.href = '/login';
};

const refreshToken = async () => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh-token`,
            {},
            { 
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );

        if (response?.data?.success && response.data.data.accessToken) {
            const newToken = response.data.data.accessToken;
            localStorage.setItem('token', newToken);
            return newToken;
        }
        throw new Error('Refresh token failed');
    } catch (error) {
        console.error('Token refresh failed:', error);
        throw error;
    }
};

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

        // Don't retry refresh token requests to avoid infinite loops
        if (originalRequest.url === '/auth/refresh-token') {
            handleAuthError();
            return Promise.reject(error);
        }

        // Check if it's an auth error and not already retrying
        if ((error.response?.data?.message === "Invalid or expired token" || 
             error.response?.status === 401) && !originalRequest._retry) {
            
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return apiClient(originalRequest);
                }).catch(err => {
                    handleAuthError();
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshToken();
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                processQueue(null, newToken);
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                handleAuthError();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;