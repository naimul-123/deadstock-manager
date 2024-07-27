"use client"
import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import { getData, postData } from '../../lib/api';
import { createContext } from 'react';
import { useContext } from 'react';
import Swal from 'sweetalert2';
import { useState } from 'react';

const ProjectionContext = createContext()

export const ProjectionProvider = ({ children }) => {
    const [projectId, setProjectId] = useState('')
    const { data: projections = [], refetch } = useQuery({
        queryKey: ['projections'],
        queryFn: () => getData('/projection/api')

    })

    const mutation = useMutation({
        mutationFn: (projectionData) => postData('/projection/api', projectionData),
        onSuccess: () => {
            Swal.fire('Projection posted successfully.')
            refetch()
        },
        onError: (error) => {
            console.error(`Error posting projection`, error)
        }
    });
    const getProjectId = (id) => {
        setProjectId(id)
    }



    const projectionInfo = { getProjectId, projections, mutation }
    return (
        <ProjectionContext.Provider value={projectionInfo}>{children}</ProjectionContext.Provider>
    );
};

export const useProjectionContext = () => {
    return useContext(ProjectionContext)
}