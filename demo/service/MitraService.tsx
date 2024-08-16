import { Demo } from '@/types';

export const MitraService = {
    getMitra() {
        return fetch('/demo/data/master-dosen.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Mitra[]);
    }
};
