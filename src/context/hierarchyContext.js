"use client"
import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import { getData, postData } from '../../lib/api';
import { createContext } from 'react';
import { useContext } from 'react';
import Swal from 'sweetalert2';
import { useState } from 'react';

const HierarchyContext = createContext()

export const HierarchyProvider = ({ children }) => {
    const [isCC, setIsCC] = useState(false)
    const { data: employees = [], isLoading: employeesLoading } = useQuery({
        queryKey: ['employees'],
        queryFn: () => getData('/employee_data')
    })
    const { data: hierarchy = {}, refetch, isLoading: hierarchyLoading } = useQuery({
        queryKey: ['hierarchy'],
        queryFn: () => getData('/environment/hierarchy/api'),
        enabled: !!employees
    })





    const mutation = useMutation({
        mutationFn: (h) => postData('/environment/hierarchy/api', h),
        onSuccess: () => {
            Swal.fire('Updated successfully.')
            refetch()
        },
        onError: (error) => {
            console.error(`Error posting projection`, error)
        }
    });
    const updateHierarchy = (e) => {
        e.preventDefault();
        let ed = null;
        let ed_cc = null;
        let hierarchyData = null;
        const form = e.target;
        if (isCC) {
            ed_cc = form.ed_cc?.value ? employees.find(e => e.sap == form.ed_cc.value) : null;
        }
        else {
            ed = form.ed?.value ? employees.find(e => e.sap == form.ed.value) : null;
        }
        const director_admin = employees.find(e => e.sap == form.director_admin.value);
        const ad_dir_admin_2 = employees.find(e => e.sap == form.ad_dir_admin_2.value);
        const ad_dir_vu = employees.find(e => e.sap == form.ad_dir_vu.value);
        const jd_admin_2 = employees.find(e => e.sap == form.jd_admin_2.value);
        const jd_vu = employees.find(e => e.sap == form.jd_vu.value);
        const dd_ds = employees.find(e => e.sap == form.dd_ds.value);
        const ad_ds = employees.find(e => e.sap == form.ad_ds.value);
        if (form.initiator.value === "dd_ds") {
            dd_ds.initiator = true;
            ad_ds.initiator = false;
        }
        else if (form.initiator.value === "ad_ds") {
            ad_ds.initiator = true;
            dd_ds.initiator = false;
        }


        hierarchyData = { ed, ed_cc, director_admin, ad_dir_admin_2, ad_dir_vu, jd_admin_2, jd_vu, dd_ds, ad_ds }
        console.log(hierarchyData);
        mutation.mutate(hierarchyData)
        setIsCC(false)
        form.reset();
        // setIsCC(false)
    }
    const hierarchyInfo = { hierarchy, employees, mutation, employeesLoading, hierarchyLoading, updateHierarchy, isCC, setIsCC }
    return (
        <HierarchyContext.Provider value={hierarchyInfo}>{children}</HierarchyContext.Provider>
    );
};

export const useHirarchyContext = () => {
    return useContext(HierarchyContext)
}