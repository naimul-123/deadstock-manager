'use client'
import React from 'react';
import Projections from '../components/projections';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Link from 'next/link';

const queryClient = new QueryClient();
const layout = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient} >
      <div className="flex flex-col">
        <div className="flex bg-slate-600">
          <Link className="inline-block py-2 px-4 hover:bg-slate-500 text-lg font-bold text-white" href="/purchase_requisition">PR Home</Link>
          <Link className="inline-block py-2 px-4 hover:bg-slate-500 text-lg font-bold text-white" href="/purchase_requisition/create_requisition">Create</Link>
          <Link className="inline-block py-2 px-4 hover:bg-slate-500 text-lg font-bold text-white" href="/purchase_requisition/create_committee">Committee</Link>
          <Link className="inline-block py-2 px-4 hover:bg-slate-500 text-lg font-bold text-white" href="/purchase_requisition/add_vendors">Add vendors</Link>
          <Link className="inline-block py-2 px-4 hover:bg-slate-500 text-lg font-bold text-white" href="/purchase_requisition/valuation">Valuation</Link>
          <Link className="inline-block py-2 px-4 hover:bg-slate-500 text-lg font-bold text-white" href="/purchase_requisition/request_for_asset_number">Request for asset number</Link>
        </div>
        {children}

      </div>
    </QueryClientProvider>

  );
};

export default layout;