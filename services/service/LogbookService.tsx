import axios from "axios";
import { Magang } from '@/types';

export const LogbookService = {
    getAllLogbook() {
        return axios.get(`${process.env.API_HOST}/logbook`)
            .then((response) => response.data.data as Magang.Logbook[])
            .catch((error) => {
                throw error;
            });
    },
    createLogbook(logbookData: Magang.Logbook) {
        return axios.post(`${process.env.API_HOST}/logbook`, logbookData)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error creating the data!", error);
                throw error;
            });
    },
    getLogbookByMahasiswa(id: string) {
        return axios.get(`${process.env.API_HOST}/logbook/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error(error);
                throw error;
            });
    },
    getLogbookMahasiswa(logbookData: Magang.Logbook) {
        return axios.post(`${process.env.API_HOST}/logbook/mahasiswa`, logbookData)
            .then((response) => response.data)
            .catch((error) => {
                console.error(error);
                throw error;
            });
    },
    deleteLogbook(id: string) {
        return axios.delete(`${process.env.API_HOST}/logbook/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error deleting the data!", error);
                throw error;
            });
    },
};