"use client";

import { type FC } from 'react';

interface ProcessingOverlayProps {
    isVisible: boolean;
    message?: string;
    stage?: 'creating' | 'processing' | 'confirming' | 'minting';
}

const ProcessingOverlay: FC<ProcessingOverlayProps> = ({
    isVisible,
    message,
    stage = 'processing'
}) => {
    if (!isVisible) return null;

    const getStageInfo = () => {
        switch (stage) {
            case 'creating':
                return {
                    text: message || 'Creando intención de pago...',
                    icon: (
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    ),
                };
            case 'processing':
                return {
                    text: message || 'Procesando pago con Stripe...',
                    icon: (
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    ),
                };
            case 'confirming':
                return {
                    text: message || 'Confirmando transacción...',
                    icon: (
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                };
            case 'minting':
                return {
                    text: message || 'Minteando tokens a tu wallet...',
                    icon: (
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                    ),
                };
            default:
                return {
                    text: message || 'Procesando...',
                    icon: (
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    ),
                };
        }
    };

    const stageInfo = getStageInfo();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="max-w-md w-full mx-4">
                <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-indigo-500/20 animate-in zoom-in duration-300">
                    {/* Animated Icon Container */}
                    <div className="relative mb-8">
                        {/* Animated Rings */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full border-4 border-indigo-500/20 animate-ping" style={{ animationDuration: '2s' }}></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-28 h-28 rounded-full border-4 border-purple-500/20 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
                        </div>

                        {/* Center Icon */}
                        <div className="relative flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <div className="text-white animate-pulse">
                                    {stageInfo.icon}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="text-center space-y-4">
                        <h3 className="text-xl font-bold text-white">
                            {stageInfo.text}
                        </h3>

                        {/* Progress Bar */}
                        <div className="relative w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 animate-indeterminate-progress"></div>
                        </div>

                        <p className="text-sm text-slate-400">
                            Por favor espera, esto puede tomar unos momentos...
                        </p>

                        {/* Loading Dots */}
                        <div className="flex justify-center items-center gap-2 pt-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="mt-6 p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                        <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                No cierres esta ventana ni refresques la página durante el proceso.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcessingOverlay;
