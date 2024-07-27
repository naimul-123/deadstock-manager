'use client'
import React from 'react';
import Projections from '../components/projections';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Link from 'next/link';
// import PrNav from '../components/sideNav';
import SideNav from '../components/sideNav';
import { HierarchyProvider } from '@/context/hierarchyContext';

const queryClient = new QueryClient();
const layout = ({ children }) => {
  const navLinks = ["hierarchy", "create_committee", "add_vendors", "valuation", "request_for_asset_number"]
  return (
    <QueryClientProvider client={queryClient} >
      <HierarchyProvider>
        <div className="flex min-h-screen">
          <SideNav data={navLinks} root="environment"></SideNav>
          <div className="grow">

            {children}
          </div>
        </div>
      </HierarchyProvider>
    </QueryClientProvider>

  );
};

export default layout;