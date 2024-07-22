'use client'
import React from 'react';
// import Projections from '../components/projections';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Link from 'next/link';
import data from '../../../../public/projections.json'
import { usePathname } from 'next/navigation';
import PrNav from '@/app/components/prNav';
const queryClient = new QueryClient();
const layout = ({ children }) => {

  return (
    <QueryClientProvider client={queryClient} >
      <div className="flex">
        <PrNav data={data} path="create_requisition"></PrNav>
        {children}

      </div>
    </QueryClientProvider>

  );
};

export default layout;