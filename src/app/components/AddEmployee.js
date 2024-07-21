"use client"
import React from 'react';
import { useState } from 'react';

const AddEmployee = ({ handleEmployee, empInfo, isShowEmp, handleIsShow }) => {

    const [emp, setEmp] = useState({})
    const handleSap = (e) => {
        setEmp({})
        const sapId = e.target.value;
        const emp = empInfo.find(e => e.sap === sapId)
        if (emp) {
            setEmp(emp)
        }
    }
    return (
        <>

            <div className="flex justify-center items-center " >
                <form className="grid grid-cols-7 gap-4 m-4 items-center justify-center" onSubmit={(e) => handleEmployee(e)}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">এস.এ.পি আইডি:</span>
                        </label>
                        <input name='sap' type="text" placeholder="এস.এ.পি আইডি লিখুন" className="input input-bordered" onBlur={handleSap} required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">নাম:</span>
                        </label>
                        <input name='name' type="text" placeholder="নাম লিখুন" disabled value={emp?.name} className="input input-bordered" />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">পদবী</span>
                        </label>
                        <input name='designation' type="text" placeholder="কর্মকর্তা/কর্মচারীর পদবী" disabled value={emp?.designation} className="input input-bordered" />


                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">শাখার নাম</span>
                        </label>
                        <select name='section' className="select select-bordered w-full" required>
                            <option value="">--Select--</option>
                            <option value="প্রকৌশল শাখা">প্রকৌশল শাখা</option>
                            <option value="আইসিটি সেল">আইসিটি সেল</option>
                        </select>

                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">নোটিং এর তারিখ</span>
                        </label>
                        <input name='notingDate' type="date" placeholder="নোটিং তারিখ  লিখুন" className="input input-bordered" required />


                    </div>

                    <div className="form-control mt-8">
                        <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500">যোগ করুন</button>
                    </div>
                    <div className="form-control mt-8">
                        <p className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500" onClick={handleIsShow} >{isShowEmp ? 'Hide' : 'Show'}</p>
                    </div>
                </form>

            </div >
        </>
    );
};

export default AddEmployee;