import axios from "axios";
import { Magang } from '@/types';
import getAuthorizationHeader from '../utils/getAuthorizationHeader';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: process.env.API_HOST, // Set your base URL here
});

// Add a request interceptor to set the authorization header for each request
apiClient.interceptors.request.use(
    (config) => {
        const headers = getAuthorizationHeader();
        // Set the Authorization header using Axios headers methods
        if (headers.Authorization) {
            config.headers['Authorization'] = headers.Authorization;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const LogbookService = {
    getAllLogbook() {
        return apiClient.get(`${process.env.API_HOST}/logbook`)
            .then((response) => response.data.data as Magang.Logbook[])
            .catch((error) => {
                throw error;
            });
    },
    createLogbook(logbookData: Magang.Logbook) {
        console.log(logbookData);
        
        return apiClient.post(`${process.env.API_HOST}/logbook`, logbookData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => response.data)
        .catch((error) => {
            console.error("There was an error creating the data!", error);
            throw error;
        });
    },
    getLogbookByMahasiswa(id: string) {
        return apiClient.get(`${process.env.API_HOST}/logbook/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error(error);
                throw error;
            });
    },
    getLogbookMahasiswa(logbookData: Magang.Logbook) {
        return apiClient.post(`${process.env.API_HOST}/logbook/mahasiswa`, logbookData)
            .then((response) => response.data)
            .catch((error) => {
                console.error(error);
                throw error;
            });
    },
    deleteLogbook(id: string) {
        return apiClient.delete(`${process.env.API_HOST}/logbook/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error deleting the data!", error);
                throw error;
            });
    },
    createLogbookMonitoring(id: string, logbookData: Magang.Logbook) {
        return apiClient.put(`${process.env.API_HOST}/logbook/monitoring/${id}`, logbookData)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error updating the data!", error);
                throw error;
            });
    },
    getLogbookMonitoring(logbookData: Magang.Logbook) {
        return apiClient.post(`${process.env.API_HOST}/logbook/monitoring`, logbookData)
            .then((response) => response.data)
            .catch((error) => {
                console.error(error);
                throw error;
            });
    },
};