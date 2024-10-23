import axios from "axios";
import { Master } from '@/types';

export const WilayahService = {
    getProvinces() {
        return axios.get(`${process.env.API_HOST}/wilayah/provinces`)
            .then((response) => response.data.data as Master.Provinces[])
            .catch((error) => {
                throw error;
            });
    },
    getRegencies(regencyData: Master.Regencies) {
        return axios.post(`${process.env.API_HOST}/wilayah/regencies`, regencyData)
            .then((response) => response.data.data as Master.Regencies[])
            .catch((error) => {
                throw error;
            });
    }
};