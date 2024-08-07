'use client'
import React from 'react';
import Link from 'next/link';
import PageNav from '@/components/PageNav';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProjectionProvider } from '@/context/projectionContext';
import { HierarchyProvider } from '@/context/hierarchyContext';
import { PrProvider } from '@/context/prContext';
const queryClient = new QueryClient();
const Prlayout = ({ children }) => {

  const paths = ['create_requisition', 'print_pr_noting', 'rfq_maintain', 'add_vendors_value', 'request_for_asset_number', 'valuation']

  return (

    <div className="flex min-h-[calc(100vh-44px)] ">
      <QueryClientProvider client={queryClient} >
        <ProjectionProvider>
          <PrProvider>
            <PageNav root="purchase_requisition" className="print:hidden" paths={paths} ></PageNav>
            <HierarchyProvider>
              <div className=" flex-grow">
                {children}
              </div>
            </HierarchyProvider>
          </PrProvider>
        </ProjectionProvider>
      </QueryClientProvider>
    </div>

  );
};

export default Prlayout;