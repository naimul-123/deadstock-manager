'use client'
import React from 'react';
import Projections from '../components/projections';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient();
const layout = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient} >
      <div className="flex">
        <Projections></Projections>
        {children}

      </div>

    </QueryClientProvider>

  );
};

export default layout;