"use client";
import React from 'react';

const Loader = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background animate-in fade-in duration-500">
            <div className="relative flex items-center justify-center">
                {/* Outer Ring */}
                <div className="h-24 w-24 rounded-full border-t-2 border-r-2 border-premium-gold animate-spin"></div>

                {/* Inner Ring (Reverse) */}
                <div className="absolute h-16 w-16 rounded-full border-b-2 border-l-2 border-premium-green animate-[spin_1.5s_linear_infinite_reverse]"></div>

                {/* Core Pulsing Icon/Text */}
                <div className="absolute flex flex-col items-center justify-center">
                    <div className="h-8 w-8 rounded-full bg-premium-gold/20 animate-pulse flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-premium-gold shadow-[0_0_15px_rgba(201,164,74,0.5)]"></div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-gradient animate-pulse">
                    NairaClare
                </h2>
                <p className="text-sm text-muted-foreground animate-in slide-in-from-bottom-2 duration-700 delay-300 font-medium">
                    Preparing your financial workspace...
                </p>
            </div>

            {/* Subtle Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-premium-gold/5 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-premium-green/5 blur-[120px] rounded-full pointer-events-none delay-700"></div>
        </div>
    );
};

export default Loader;
