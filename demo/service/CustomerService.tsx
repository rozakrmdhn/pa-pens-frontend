import { Demo } from '@/types';

export const CustomerService = {
    getCustomersSmall() {
        return fetch('/demo/data/customers-small.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Customer[]);
    },

    getCustomersMedium() {
        return fetch('/demo/data/customers-medium.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Customer[]);
    },

    getCustomersLarge() {
        return fetch('/demo/data/customers-large.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Customer[]);
    }
};
