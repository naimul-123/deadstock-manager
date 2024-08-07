"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const PrList = ({ heading, pr_number, prdata, handlePrNumber, path }) => {

    return (
        <div className="flex flex-col  w-64  shrink-0 print:hidden">
            <h2 className={`py-2 px-4  bg-slate-600 text-white`}>{heading}</h2>
            <ul>

                {prdata && prdata.length > 0 ? prdata.map((pr) => (<li key={pr.pr_number} className={`py-2 text-center px-4 block ${pr.pr_number === pr_number ? "bg-slate-500 hover:bg-slate-500 text-white" : ""} hover:text-white hover:bg-slate-400`} onClick={() => handlePrNumber(pr.pr_number)} > <Link href={`/purchase_requisition${path}`}>{pr.pr_number}</Link> </li>)

                ) : ''
                }
            </ul>
        </div>

    );
};
export default PrList;