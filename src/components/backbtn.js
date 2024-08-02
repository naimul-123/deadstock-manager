"use client"
import { useRouter } from 'next/navigation';
import React from 'react';

const Backbtn = () => {
    const router = useRouter();
    const handleClick = () => {

        router.push('/');
    }
    return (
        <button className="inline-block py-2 px-4 hover:bg-slate-500 text-lg font-bold text-white" onClick={handleClick}>Go back</button>

    );
};

export default Backbtn;