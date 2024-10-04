/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

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
                { label: 'Ploting Dosbing', icon: 'pi pi-fw pi-users', to: '' },
                { label: 'Laporan', icon: 'pi pi-fw pi-chart-bar', to: '/laporan'},
            ]
        },
        {
            label: 'Master Data',
            items: [
                { label: 'Dosen', icon: 'pi pi-fw pi-database', to: '/master/dosen'},
                { label: 'Mahasiswa', icon: 'pi pi-fw pi-database', to: '/master/mahasiswa'},
                { label: 'Mitra', icon: 'pi pi-fw pi-database', to: '/master/mitra'},
            ]
        },
        {
            label: 'Pengaturan',
            items: [
                { label: 'Profil', icon: 'pi pi-fw pi-user', to: '/pengaturan/profil'},
                { label: 'Keamanan', icon: 'pi pi-fw pi-lock', to: '/pengaturan/keamanan'},
                { label: 'Logout', icon: 'pi pi-fw pi-sign-out', to: '/'}
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
