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
import { HierarchyProvider } from '@/context/hierarchyContext';
import { ProjectionProvider } from '@/context/projectionContext';

const queryClient = new QueryClient();
const layout = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient} >
      <div className="flex">
        <ProjectionProvider>
          <Projections></Projections>
          <HierarchyProvider>
            {children}
          </HierarchyProvider>
        </ProjectionProvider>

      </div>

    </QueryClientProvider>

  );
};

export default layout;