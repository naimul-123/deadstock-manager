"use client"
import { banglaToDecimal, benWord, decimalToBangla, indianNumberFormat } from '@/utils/benword';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { AlignmentType, Document, FrameAnchorType, HorizontalPositionAlign, Packer, PageOrientation, Paragraph, TextRun, VerticalPositionAlign } from 'docx';
import { useRef } from 'react';
import saveAs from 'file-saver'
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { usePrContext } from '@/context/prContext';
import PrList from '@/components/prLIst';
import { useHirarchyContext } from '@/context/hierarchyContext';
import { getData } from '../../../../../lib/api';
import Swal from 'sweetalert2';
import VendorValue from '@/app/components/vendorValue';

moment.locale('bn')
const Project = ({ params }) => {
    const [takaInword, setTakaInWord] = useState('')
    const [formatedPrice, setFormatedPrice] = useState('')
    const [totalPrice, setTotalPrice] = useState(0)
    const [items, setItems] = useState('')
    const [totalQuantity, setTotalQty] = useState(0)
    const [closeVendorId, setCloseVendorId] = useState(null)
    const [valueInfo, setValueInfo] = useState([])


    const { rfqData: projection, rfqPrNumber } = usePrContext();

    console.log(valueInfo);

    console.log(projection);



    useEffect(() => {
        setValueInfo([])
        let total = 0;
        let totalQuantity = 0;
        let con = "";
        let items = '';
        projection?.items.forEach((item, id) => {
            if (id === 0) {
                con = ""
            }
            else if (id > 0 && projection.items.length === 2) {
                con = "এবং"
            }
            else if (id > 0 && id === projection.items.length - 1) {
                con = "এবং"
            }
            else {
                con = ","
            }

            items += `${con} ${item.quantity < 10 ? '০' : ''}${decimalToBangla((item.quantity).toString())}টি ${item.goods_name_bn} `
            total += item.unit_price * item.quantity;
            totalQuantity += item.quantity;
        })

        setItems(items)
        setTotalQty(totalQuantity)
        setTotalPrice(total);
        setTakaInWord(benWord(total));
        setFormatedPrice(indianNumberFormat(total));
    }, [projection])





    return (
        <div className="grow h-[calc(100vh - 44px)] scroll-auto overflow-y-auto">
            <div className="shrink-0">
                {projection &&
                    <div className="font-[sutonnyOMJ]">

                        <div className="flex p-2  gap-2 justify-between items-center shadow-lg bg-[#D9EEE1] sticky top-0 z-20 ">
                            <h2 className="text-2xl font-bold"> পারসেজ রিকুইজিশন নং- {rfqPrNumber}</h2>
                            <p className="font-bold text-center "> </p>
                            <div className="flex gap-2 justify-between items-center">
                                <button className="btn bg-[#04AA6D] text-white hover:text-[#04AA6D]" >প্রাক্কলিত মোট মূল্য= ৳{formatedPrice}</button>
                            </div>
                        </div>
                        {
                            projection.rfqInfo.vendors?.map(vendor =>
                                <VendorValue vendor={vendor} valueInfo={valueInfo} setValueInfo={setValueInfo} items={projection.items} key={vendor.vendor_id}></VendorValue>

                            )
                        }


                    </div>
                }


            </div>


        </div>
    );
};

export default Project;