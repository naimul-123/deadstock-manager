"use client"
import React, { useState } from 'react';
import { benWord, engWord, indianNumberFormat } from '@/utils/benword';

const Test = () => {
    const [word, setWord] = useState('')

    const handleChange = (e) => {

        setWord(indianNumberFormat(e.target.value))

    }
    return (
        <div className="max-w-screen-md min-h-screen flex flex-col justify-center items-center mx-auto gap-3">
            <input
                type="text"
                placeholder="Type here"

                className="input input-bordered input-primary w-full max-w-xs" onChange={handleChange} />
            {word && <p>{word}</p>}

        </div>
    );
};

export default Test;