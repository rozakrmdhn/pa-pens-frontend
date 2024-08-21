import axios from 'axios';
import { Demo } from '@/types';

export const DosenService = {
    getDosen() {
        return axios.get(`${process.env.API_HOST}/dosen`)
            .then((response) => response.data.data as Demo.Dosen[])
    }
};