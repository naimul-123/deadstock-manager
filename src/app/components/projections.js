"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useEffect, useState } from 'react';

const Projections = () => {
    const [data, setData] = useState([])
    const pathName = usePathname();
    useEffect(() => {
        const getData = async () => {
            const res = await fetch('projections.json')
            const data = await res.json()
            const projections = data.filter((item) => !(item.pr_number))
            setData(projections)
        }

        getData()

    }, [])


    return (
        <div className="max-w-64 text-lg border-r-2 h-screen">
            <ul>
                <li><Link className={`py-2 px-4 block hover:bg-gray-300`} href={`/projection/`}>Projection Home</Link></li>
                {data && data.length > 0 ? data.map((project) => {
                    const isActive = pathName.startsWith(`/projection/${project._id}`)
                    return (<li key={project._id}><Link className={`py-2 px-4 block  ${isActive ? 'bg-[#04AA6D] text-white hover:bg-[#04AA6D] ' : 'hover:bg-gray-300'}`} href={`/projection/${project._id}`} >{project.notingHeading}</Link></li>)
                }
                ) : ''
                }


            </ul>
        </div>
    );
};

export default Projections;