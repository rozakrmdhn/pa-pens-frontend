"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BreadCrumb } from "primereact/breadcrumb";
import { useRouter } from 'next/navigation';
import { Message } from 'primereact/message';
import { AuthService } from '@/services/service/AuthService';

type UserActive = {
    user?: {
        id?: string;
        nama?: string;
        id_mahasiswa?: string;
        id_dosen?: string;
        role?: string;
    }
};

const Example = () => {
    const router = useRouter();
    const [userActive, setUserActive] = useState<UserActive>({});

    // Breadcrumb
    const breadcrumbHome = { icon: 'pi pi-home', command: () => router.push('/dashboard') };
    const breadcrumbItems = [
        { label: 'Beranda' }
    ];

    const content = (
        <div className="flex align-items-center">
            <div className="ml-1">Pengajuan sedang diproses</div>
        </div>
    );

    useEffect(() => {
        const userActive = AuthService.getCurrentUser();
        setUserActive({ ...userActive });
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <BreadCrumb home={breadcrumbHome} model={breadcrumbItems} />
            </div>
            <div className="col-12">
                <div className="flex justify-content-between my-1">
                    <h5>Hi, { userActive.user?.nama}</h5>
                </div>
                <div className="card p-3">
                    <Message 
                    style={{ border: 'solid #696cff', borderWidth: '0 0 0 6px', color: '#696cff' }}
                    className="border-primary w-full justify-content-start" 
                    severity="info"
                    text={content}
                    />
                </div>
            </div>
        </div>
    );
};

export default Example;