'use client'
import React from 'react';
// import Projections from '../components/projections';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Link from 'next/link';
import data from '../../../../public/projections.json'
import PrNav from '@/app/components/prNav';
const queryClient = new QueryClient();
const layout = ({ children }) => {
  const prData = data.filter((item) => item.pr_number)
  return (
    <QueryClientProvider client={queryClient} >
      <div className="flex">

        <PrNav data={prData} path="create_committee"></PrNav>
        {children}

      </div>
    </QueryClientProvider>

  );
};

export default layout;