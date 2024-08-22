import { Demo } from '@/types';

export const MahasiswaService = {
    getMahasiswa() {
        return fetch('/demo/data/data-mahasiswa.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Customer[]);
    }
};
