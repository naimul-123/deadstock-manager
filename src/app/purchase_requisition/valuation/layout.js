"use client"
import PrList from '@/components/prLIst';
import { HierarchyProvider } from '@/context/hierarchyContext';
import { PrProvider, usePrContext } from '@/context/prContext';
import { ProjectionProvider } from '@/context/projectionContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
const queryClient = new QueryClient();
const Layout = ({ children }) => {
    const { prnumbers, prNumberLoading, prDataLoading, handlePrNumber, pr_number, committeeSetup, rfqPrNumber, rfqprnumbers, handleRfqPrNumber, rfqData } = usePrContext();

    return (

        <div className=" bg-base-200 flex justify-between  max-h-[calc(100vh-44px)]">

            {children}
            <div className="flex flex-col justify-between bg-[#E7E9EB] scroll-auto overflow-y-auto min-w-fit ">
                <div className="min-h-[calc(50vh-22px)]">
                    <PrList path="/valuation/vendors_value" pr_number={rfqPrNumber} prdata={rfqprnumbers} heading=" একটি পিআর নাম্বার সিলেক্ট করুন " handlePrNumber={handleRfqPrNumber}></PrList>
                </div>
                {/* <div className="min-h-[calc(50vh-22px)]">
                    <PrList path="/valuation/print_valuation_report" pr_number={rfqPrNumber} prdata={rfqprnumbers} heading="একটি পিআর নাম্বার সিলেক্ট করুন" handlePrNumber={handleRfqPrNumber}></PrList>
                </div> */}

            </div>

        </div>
    );
};;

export default Layout;