import { Demo } from '@/types';

export const DosenService = {
    getDosen() {
        return fetch('/demo/data/master-dosen.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Dosen[]);
    }
};
