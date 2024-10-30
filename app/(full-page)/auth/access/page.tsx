/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from 'primereact/button';

const AccessDeniedPage = () => {
    const router = useRouter();

    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div className="flex flex-column align-items-center justify-content-center">
            <img src="https://reg.mbkm.pens.ac.id/assets/dist/img/logo_pens.png" alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div className="w-full surface-card py-5 px-5 sm:px-5" style={{ borderRadius: '25px' }} >
                    <div className="flex flex-column align-items-center" style={{ borderRadius: '53px' }}>
                        <div className="flex justify-content-center align-items-center bg-pink-500 border-circle" style={{ height: '3.2rem', width: '3.2rem' }}>
                            <i className="pi pi-fw pi-exclamation-circle text-2xl text-white"></i>
                        </div>
                        <h1 className="text-900 font-bold text-5xl mb-2">Access Denied</h1>
                        <div className="text-600 mb-5">You do not have the necessary permisions.</div>
                        <img src="/demo/images/access/asset-access.svg" alt="Error" className="mb-5" width="80%" />
                        <Button icon="pi pi-arrow-left" label="Go to Login" text onClick={() => router.push('/auth')} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessDeniedPage;
