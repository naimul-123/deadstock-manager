'use client'
import React from 'react';
import Projections from '../components/projections';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Link from 'next/link';
import PrNav from '../components/prNav';

const queryClient = new QueryClient();
const layout = ({ children }) => {
  const navLinks = ["create_requisition", "create_committee", "add_vendors", "valuation", "request_for_asset_number"]
  return (
    <QueryClientProvider client={queryClient} >
      <div className="flex min-h-screen">
        <PrNav data={navLinks}></PrNav>
        <div className="grow">
          {children}
        </div>


      </div>
    </QueryClientProvider>

  );
};

export default layout;