"use client"
import PrList from '@/components/prLIst';
import { HierarchyProvider } from '@/context/hierarchyContext';
import { PrProvider, usePrContext } from '@/context/prContext';
import { ProjectionProvider } from '@/context/projectionContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
const queryClient = new QueryClient();
const Layout = ({ children }) => {
    const { prnumbers, prNumberLoading, prDataLoading, prData: projection, handlePrNumber, pr_number, committeeSetup, rfqPrNumber, rfqprnumbers, handleRfqPrNumber, rfqData } = usePrContext();

    return (

        <div className=" bg-base-200 min-h-[calc(100vh - 44px)] flex justify-between">

            {children}
            <div className="flex flex-col justify-between bg-[#E7E9EB] min-h-[calc(100vh - 44px)] print:hidden ">
                <div className="min-h-[calc(50vh-22px)]">
                    <PrList path="/rfq_maintain/rfq_setup" pr_number={pr_number} prdata={prnumbers} heading=" একটি পিআর নাম্বার সিলেক্ট করুন " handlePrNumber={handlePrNumber}></PrList>
                </div>
                <div className="min-h-[calc(50vh-22px)]">
                    <PrList path="/rfq_maintain/print_rfq_letter" pr_number={rfqPrNumber} prdata={rfqprnumbers} heading="একটি পিআর নাম্বার সিলেক্ট করুন" handlePrNumber={handleRfqPrNumber}></PrList>
                </div>
            </div>

        </div>
    );
};;

export default Layout;