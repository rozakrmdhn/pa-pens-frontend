/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';
import { AuthService } from '@/services/service/AuthService';
import { useRouter } from 'next/navigation';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();

    const handleLogout = () => {
        AuthService.logout();
        router.push('/auth');
    };

    const model: AppMenuItem[] = [
        {
            label: 'Beranda',
            items: [{ label: 'Beranda', icon: 'pi pi-fw pi-home', to: '/dashboard' }]
        },
        {
            label: 'Modul Magang',
            items: [
                { label: 'Pengajuan', icon: 'pi pi-fw pi-envelope', to: '/pengajuan'},
                { label: 'Monitoring', icon: 'pi pi-fw pi-desktop', to: '/monitoring'},
                { label: 'Logbook', icon: 'pi pi-fw pi-file-edit', to: '/logbook'},
            ]
        },
        {
            label: 'Laporan',
            items: [
                { label: 'Laporan', icon: 'pi pi-fw pi-chart-bar', to: '/laporan/magang'},
                { label: 'Ploting Dosen', icon: 'pi pi-fw pi-users', to: '/laporan/ploting' },
                { label: 'Sebaran Mahasiswa', icon: 'pi pi-fw pi-map', to: '/laporan/sebaran-mahasiswa' },
                { label: 'Kehadiran Mahasiswa', icon: 'pi pi-fw pi-chart-pie' }
            ]
        },
        {
            label: 'Master Data',
            items: [
                { label: 'Dosen', icon: 'pi pi-fw pi-database', to: '/master/dosen'},
                { label: 'Mahasiswa', icon: 'pi pi-fw pi-database', to: '/master/mahasiswa'},
                { label: 'Mitra', icon: 'pi pi-fw pi-database', to: '/master/mitra'},
                // { label: 'Klasifikasi KP', icon: 'pi pi-fw pi-link', to: '' },
            ]
        },
        {
            label: 'Pengaturan',
            items: [
                { label: 'Profil', icon: 'pi pi-fw pi-user', to: '/pengaturan/profil'},
                { label: 'Keamanan', icon: 'pi pi-fw pi-lock', to: '/pengaturan/keamanan'},
                { label: 'Logout', icon: 'pi pi-fw pi-sign-out', command: handleLogout}
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
