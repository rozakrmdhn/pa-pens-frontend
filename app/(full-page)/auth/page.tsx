/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { AuthService } from '@/services/service/AuthService';

const LoginPage = () => {
    const toast = useRef<Toast>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const handleLogin = async () => {
        try {
            const userData = { email, password }; // Form user data for the request
            const response = await AuthService.login(userData);

            if (response) {
                // Redirect on successful login
                router.push('/');
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message;
            toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
        }
    };

    return (
        <div className={containerClassName}>
            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <img src="https://reg.mbkm.pens.ac.id/assets/dist/img/logo_pens.png" alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div className="w-full surface-card py-5 px-5 sm:px-5" style={{ borderRadius: '20px' }}>
                    <div className="text-center mb-5">
                        <span className="text-600 font-medium">Sign in to continue</span>
                    </div>
                    <div>
                        <label htmlFor="email1" className="block text-900 text-md font-medium mb-2">
                            Email
                        </label>
                        <InputText
                            id="email1"
                            type="text"
                            placeholder="Email address"
                            className="w-full md:w-30rem mb-5"
                            style={{ padding: '1rem' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label htmlFor="password1" className="block text-900 font-medium text-md mb-2">
                            Password
                        </label>
                        <Password
                            inputId="password1"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            toggleMask
                            className="w-full mb-5"
                            inputClassName="w-full p-3 md:w-30rem"
                        ></Password>

                        <div className="flex align-items-center justify-content-between mb-5 gap-5">
                            <div className="flex align-items-center">
                                <Checkbox
                                    inputId="rememberme1"
                                    checked={checked}
                                    onChange={(e) => setChecked(e.checked ?? false)}
                                    className="mr-2"
                                ></Checkbox>
                                <label htmlFor="rememberme1">Remember me</label>
                            </div>
                            <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                Forgot password?
                            </a>
                        </div>
                        <Button label="Sign In" className="w-full p-3 text-md" onClick={handleLogin}></Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
