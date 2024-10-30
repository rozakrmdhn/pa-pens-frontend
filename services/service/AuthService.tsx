import Cookies from 'js-cookie';
import { NextResponse, NextRequest } from 'next/server'
import axios, { AxiosInstance } from "axios";
import { Master } from '@/types';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: process.env.API_HOST, // Set your base URL here
});

// Set up an interceptor for automatic token refreshing
apiClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        
        // Check if error is due to an expired token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const newAccessToken = await AuthService.refreshAccessToken();
                
                // Set the new token in headers and retry the original request
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error("Refresh failed:", refreshError);
                AuthService.logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const AuthService = {
    async login(userData: Master.Auth) {
        try {
            const response = await apiClient.post('/auth/signin', userData);
            const { accessToken, user } = response.data.data;

            // Set the token as a cookie
            Cookies.set('currentUser', JSON.stringify({ accessToken, user }), { expires: 7 });

            return { accessToken, user };
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    },

    async refreshAccessToken() {
        const refreshToken = Cookies.get('currentUser');
        if (!refreshToken) throw new Error("No refresh token available.");

        try {
            const response = await apiClient.post('/auth/refresh', { refreshToken });
            const { accessToken } = response.data.data;

            // Update access token cookie
            Cookies.set('currentUser', accessToken, { expires: 1 });
            return accessToken;
        } catch (error) {
            console.error("Failed to refresh token:", error);
            AuthService.logout();
            throw error;
        }
    },

    logout() {
        Cookies.remove('currentUser');
    },

    getCurrentUser() {
        const currentUser = Cookies.get('currentUser');
        return currentUser ? JSON.parse(currentUser) : null;
    }
};