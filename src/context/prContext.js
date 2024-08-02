"use client"
import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import { getData, postData, putData } from '../../lib/api';
import { createContext } from 'react';
import { useContext } from 'react';
import Swal from 'sweetalert2';
import { useState } from 'react';

const PrContext = createContext()

export const PrProvider = ({ children }) => {
    const [projectId, setProjectId] = useState('')
    const [pr_number, setPr] = useState(null)
    const handlePrNumber = (n) => {
        setPr(n)
    }
    const { data: projections = [], refetch: projectionRefetch } = useQuery({
        queryKey: ['projections'],
        queryFn: () => getData('/projection/api')

    })

    const { data: prnumbers = [], isloading: prNumberLoading, refetch: prRefetch } = useQuery({
        queryKey: ['pr_numbers'],
        queryFn: () => getData('/purchase_requisition/api/pr_noting')
    })

    const { data: prData = null, isLoading: prDataLoading, refetch: prdataRefetch } = useQuery({
        queryKey: ['prdata', pr_number],
        queryFn: () => getData(`/purchase_requisition/api/pr_noting?pr=${pr_number}`),
        enabled: !!pr_number,
    })

    const mutation = useMutation({
        mutationFn: (projectionData) => putData('/purchase_requisition/api/pr_noting', projectionData),
        onSuccess: (result) => {
            if (result.result?.modifiedCount === 1) {

                Swal.fire({
                    title: "Success!",
                    text: result.message,
                    icon: "success"
                });
                prRefetch();
                projectionRefetch();
                setPr(null)
            }
            else {
                Swal.fire({
                    title: "Error!",
                    text: result.message,
                    icon: "error"
                });
            }
        },
        onError: (error) => {
            console.error(`Error posting projection`, error)
        }
    });
    const committeeSetup = useMutation({
        mutationFn: (committeeData) => putData('/purchase_requisition/api/committe_setup', committeeData),
        onSuccess: (result) => {
            if (result.result?.modifiedCount === 1) {
                Swal.fire({
                    title: "Success!",
                    text: result.message,
                    icon: "success"
                });
                prRefetch();
                setPr(null)
            }
            else {
                Swal.fire({
                    title: "Error!",
                    text: result.message,
                    icon: "error"
                });
            }
        },
        onError: (error) => {
            console.error(`Error posting projection`, error)
        }
    });
    const getProjectId = (id) => {
        setProjectId(id)
    }
    const PrInfo = { getProjectId, projections, mutation, prnumbers, pr_number, prNumberLoading, prData, prDataLoading, handlePrNumber, committeeSetup }
    return (
        <PrContext.Provider value={PrInfo}>{children}</PrContext.Provider>
    );
};

export const usePrContext = () => {
    return useContext(PrContext)
}