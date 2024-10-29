import axios from 'axios';
import { Master } from '@/types';
import getAuthorizationHeader from '../utils/getAuthorizationHeader';

export const DosenService = {
    async getDosen() {
        try {
            const headers = await getAuthorizationHeader();
            const response = await axios.get(`${process.env.API_HOST}/dosen`, {
                headers
            });
            return response.data.data as Master.Dosen[];
        } catch (error) {
            console.error("Error fetching the data!", error);
            throw error;
        }
    },
    async deleteDosen(id: string) {
        try {
            const headers = await getAuthorizationHeader();
            const response = await axios.delete(`${process.env.API_HOST}/dosen/${id}`, {
                headers
            });
            return response.data;
        } catch (error) {
            console.error("There was an error deleting the data!", error);
            throw error;
        }
    },
    async createDosen(dosenData: Master.Dosen) {
        try {
            const headers = await getAuthorizationHeader();
            const response = await axios.post(`${process.env.API_HOST}/dosen`, dosenData, {
                headers
            });
            return response.data;
        } catch (error) {
            console.error("There was an error creating the dosen!", error);
            throw error;
        }
    },
    async updateDosen(id: string, dosenData: Master.Dosen) {
        try {
            const headers = await getAuthorizationHeader();
            const response = await axios.put(`${process.env.API_HOST}/dosen/${id}`, dosenData, {
                headers
            });
            return response.data;
        } catch (error) {
            console.error("There was an error updating the data!", error);
            throw error;
        }
    },
    async plotingDosenList() {
        try {
            const headers = await getAuthorizationHeader();
            const response = await axios.get(`${process.env.API_HOST}/dosen/ploting`, {
                headers
            });
            return response.data.data as Master.Dosen[]
        } catch (error) {
            throw error;
        }
    }
};