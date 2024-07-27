"use client"
import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import { getData, postData } from '../../../../lib/api';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useHirarchyContext } from '@/context/hierarchyContext';

const HierarchySetup = () => {
    const { hierarchy, employees, mutation, employeesLoading, hierarchyLoading, updateHierarchy, isCC, setIsCC } = useHirarchyContext();
    if (employeesLoading || hierarchyLoading) {
        return <div className="flex flex-col justify-center items-center shrink-0 min-h-full"><span className="loading loading-spinner text-info"></span></div>
    }
    return (
        <div className="p-8 bg-base-200  space-y-2  shrink-0">
            <div className="card shadow-lg bg-slate-500 ">
                <div>
                    <form className="grid grid-cols-4 justify-center items-center  gap-4 m-4" onSubmit={(e) => updateHierarchy(e)}>
                        <div className="form-control">
                            <label className="label cursor-pointer gap-2">
                                <span className="label-text">নির্বাহী পরিচালক</span>
                                <span className="label-text">(চলতি দায়িত্বে)</span>
                                <input type="checkbox" className="checkbox checkbox-xs" checked={isCC} onChange={() => setIsCC(!isCC)} />
                            </label>
                            {
                                isCC ? <select name='ed_cc' className="select select-bordered w-full" defaultValue={hierarchy?.ed_cc?.sap || ""} required>
                                    <option value="">---Select---</option>
                                    {employees?.filter((e) => e.designation_bn === "পরিচালক").map((e) => <option key={e.sap} value={e.sap}>{e.name_bn}</option>)}
                                </select> :
                                    <select name='ed' className="select select-bordered w-full" defaultValue={hierarchy?.ed?.sap || ""} required>
                                        <option value="">---Select---</option>
                                        {employees?.filter((e) => e.designation_bn === "নির্বাহী পরিচালক").map((e) => <option key={e.sap} value={e.sap}>{e.name_bn}</option>)}
                                    </select>
                            }
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">পরিচালক(প্রশাসন)</span>
                            </label>
                            <select name='director_admin' className="select select-bordered w-full" defaultValue={hierarchy?.director_admin?.sap} required>
                                <option value="">---Select---</option>
                                {employees?.filter((e) => e.designation_bn === "পরিচালক").map((e) => <option key={e.sap} value={e.sap}>{e.name_bn}</option>)}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">অতিরিক্ত  পরিচালক(প্রশাসন-২)</span>
                            </label>
                            <select name='ad_dir_admin_2' className="select select-bordered w-full" defaultValue={hierarchy?.ad_dir_admin_2?.sap} required>
                                <option value="">---Select---</option>
                                {employees?.filter((e) => e.designation_bn === "অতিরিক্ত পরিচালক").map((e) => <option key={e.sap} value={e.sap}>{e.name_bn}</option>)}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">অতিরিক্ত  পরিচালক(ভিইউ)</span>
                            </label>
                            <select name='ad_dir_vu' className="select select-bordered w-full" defaultValue={hierarchy?.ad_dir_vu?.sap} required>
                                <option value="">---Select---</option>
                                {employees?.filter((e) => e.designation_bn === "অতিরিক্ত পরিচালক").map((e) => <option key={e.sap} value={e.sap}>{e.name_bn}</option>)}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">যুগ্মপরিচালক(প্রশাসন-২)</span>
                            </label>
                            <select name='jd_admin_2' className="select select-bordered w-full" defaultValue={hierarchy?.jd_admin_2?.sap} required>
                                <option value="">---Select---</option>
                                {employees?.filter((e) => e.designation_bn === "যুগ্মপরিচালক").map((e) => <option key={e.sap} value={e.sap}>{e.name_bn}</option>)}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">যুগ্মপরিচালক(ভিইউ)</span>
                            </label>
                            <select name='jd_vu' className="select select-bordered w-full" defaultValue={hierarchy?.jd_vu?.sap} required>
                                <option value="">---Select---</option>
                                {employees?.filter((e) => e.designation_bn === "যুগ্মপরিচালক").map((e) => <option key={e.sap} value={e.sap}>{e.name_bn}</option>)}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">উপপরিচালক(জড়সামগ্রী)</span>
                            </label>
                            <select name='dd_ds' className="select select-bordered w-full" defaultValue={hierarchy?.dd_ds?.sap} required>
                                <option value="">---Select---</option>
                                {employees?.filter((e) => e.designation_bn === "উপপরিচালক").map((e) => <option key={e.sap} value={e.sap}>{e.name_bn}</option>)}
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">সহকারী  পরিচালক(জড়সামগ্রী)</span>
                            </label>
                            <select name='ad_ds' className="select select-bordered w-full" defaultValue={hierarchy?.ad_ds?.sap} required>
                                <option value="">---Select---</option>
                                {employees?.filter((e) => e.designation_bn === "সহকারী পরিচালক").map((e) => <option key={e.sap} value={e.sap}>{e.name_bn}</option>)}
                            </select>
                        </div>
                        <div className="form-control mt-4 col-span-full ">
                            <div className="flex justify-end">
                                <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500">তথ্য আপডেট করুন</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <>
                <div className={`text-justify  border font-[SutonnyOMJ]    p-8 }`}>
                    <h2 className="font-bold underline text-center pb-3 text-2xl ">Noting Hierarchy</h2>
                    <table className="table table-zebra max-w-screen-md mx-auto text-2xl font-[sutonnyOMJ] bg-slate-300 border">
                        <thead className="text-2xl font-bold text-black font-[sutonnyOMJ]">
                            <tr className="">
                                <td >ক্রঃ</td>
                                <td>নাম</td>
                                <td>পদবী</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                hierarchy.ed ? <tr>
                                    <td>০১.</td>
                                    <td>{hierarchy.ed?.name_bn}</td>
                                    <td>নির্বাহী পরিচালক</td>
                                </tr> :
                                    <tr>
                                        <td>০১.</td>
                                        <td>{hierarchy.ed_cc?.name_bn}</td>
                                        <td>নির্বাহী পরিচালক(চলতি দ্বায়িত্বে)</td>
                                    </tr>
                            }
                            <tr>
                                <td>০২.</td>
                                <td>{hierarchy.director_admin?.name_bn}</td>
                                <td>পরিচালক(প্রশাসন)</td>
                            </tr>
                            <tr>
                                <td>০৩.</td>
                                <td>{hierarchy.ad_dir_admin_2?.name_bn}</td>
                                <td>অতিরিক্ত পরিচালক(প্রশাসন-২)</td>
                            </tr>
                            <tr>
                                <td>০৪.</td>
                                <td>{hierarchy.ad_dir_vu?.name_bn}</td>
                                <td>অতিরিক্ত পরিচালক(প্রশাসন-২)</td>
                            </tr>
                            <tr>
                                <td>০৫.</td>
                                <td>{hierarchy.jd_admin_2?.name_bn}</td>
                                <td>যুগ্মপরিচালক(প্রশাসন-২)</td>
                            </tr>
                            <tr>
                                <td>০৬.</td>
                                <td>{hierarchy.jd_vu?.name_bn}</td>
                                <td>যুগ্মপরিচালক(প্রশাসন-২)</td>
                            </tr>
                            <tr>
                                <td>০৭.</td>
                                <td>{hierarchy.dd_ds?.name_bn}</td>
                                <td>উপপরিচালক(জড়সামগ্রী)</td>

                            </tr>
                            <tr>
                                <td>০৮.</td>
                                <td>{hierarchy.ad_ds?.name_bn}</td>
                                <td>সহকারী পরিচালক(জড়সামগ্রী)</td>
                            </tr>
                        </tbody>
                        <tfoot className="text-2xl font-bold text-black">
                            <tr>
                                <td >ক্রঃ</td>
                                <td>নাম</td>
                                <td>পদবী</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </>
        </div>
    );
};


export default HierarchySetup;