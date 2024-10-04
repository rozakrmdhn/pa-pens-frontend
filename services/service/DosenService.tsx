import axios from 'axios';
import { Demo } from '@/types';

export const DosenService = {
    getDosen() {
        return axios.get(`${process.env.API_HOST}/dosen`)
            .then((response) => response.data.data as Demo.Dosen[])
            .catch((error) => {
                throw error;
            });
    },
    deleteDosen(id: string) {
        return axios.delete(`${process.env.API_HOST}/dosen/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error deleting the dosen!", error);
                throw error;
            });
    },
    createDosen(dosenData: Demo.Dosen) {
        return axios.post(`${process.env.API_HOST}/dosen`, dosenData)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error creating the dosen!", error);
                throw error;
            });
    },
    updateDosen(id: string, dosenData: Demo.Dosen) {
        return axios.put(`${process.env.API_HOST}/dosen/${id}`, dosenData)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error updating the dosen!", error);
                throw error;
            });
    },
    getDosenById() {
        
    }
};