import Cookies from 'js-cookie';
import { NextResponse, NextRequest } from 'next/server'
import axios, { AxiosInstance } from "axios";
import { Master } from '@/types';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: process.env.API_HOST, // Set your base URL here
});

export const AuthService = {
    async login(userData: Master.User) {
        try {
            const response = await apiClient.post('/auth/signin', userData);
            const { accessToken, user } = response.data.data;

            // Set the token as a cookie
            Cookies.set('currentUser', JSON.stringify({ accessToken, user }), { expires: 7 });

            const cook = NextResponse.next();
            cook.cookies.set('auth-token', JSON.stringify({ accessToken, user }));

            return { accessToken, user };
        } catch (error) {
            console.error("Login failed:", error);
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