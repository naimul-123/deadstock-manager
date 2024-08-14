import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/../lib/mongodb";
import { ObjectId } from "mongodb";
const client = await clientPromise;
const db = client.db('deadstock');
const procurementCollection = db.collection('procurements')
const assetGlinfoCollection = db.collection('assetGlinfo')

export async function GET(request) {

    try {
        const { searchParams } = new URL(request.url)
        const pr = searchParams.get("pr")

        let query = { pr_number: { $exists: true }, committeeInfo: { $exists: true }, rfqInfo: { $exists: true } }
        if (pr) {
            query.pr_number = pr
            const aggregationPipeline = [
                { $match: query },
                { $unwind: "$receiverInfo" },
                { $unwind: "$receiverInfo.itemInfo" },
                {
                    $group: {
                        _id: {
                            goods_model: "$receiverInfo.itemInfo.goods_model",
                            unit_price: "$receiverInfo.itemInfo.unit_price"
                        },
                        goods_name_bn: { $first: "$receiverInfo.itemInfo.goods_name_bn" },
                        goods_name_en: { $first: "$receiverInfo.itemInfo.goods_name_en" },
                        quantity: { $sum: { $toInt: "$receiverInfo.itemInfo.quantity" } },
                        notingHeading: { $first: "$notingHeading" },
                        GL_Account: { $first: "$GL_Account" },
                        pr_number: { $first: "$pr_number" }, // Capture pr_number
                        rfqInfo: { $first: "$rfqInfo" },
                        committeeInfo: { $first: "$committeeInfo.chairman" },// Capture vendors
                        projectionNotingHierarchy: { $first: "$projectionNotingHierarchy" },// Capture vendors
                    }
                },
                {
                    $group: {
                        _id: null,
                        items: {
                            $push: {
                                goods_model: "$_id.goods_model",
                                unit_price: "$_id.unit_price",
                                goods_name_bn: "$goods_name_bn",
                                goods_name_en: "$goods_name_en",
                                quantity: "$quantity",
                            }
                        },
                        notingHeading: { $first: "$notingHeading" },
                        GL_Account: { $first: "$GL_Account" },
                        pr_number: { $first: "$pr_number" },
                        rfqInfo: { $first: "$rfqInfo" },
                        committeeInfo: { $first: "$committeeInfo" },
                        projectionNotingHierarchy: { $first: "$projectionNotingHierarchy" },

                    },


                },
                {
                    $lookup: {
                        from: "assetGlinfo",
                        localField: "GL_Account",
                        foreignField: "GL_Account",
                        as: "asset_info"
                    }
                },

                {
                    $addFields: {
                        File_Index: { $arrayElemAt: ["$asset_info.File_Index", 0] }
                    }
                },

                {
                    $project: {
                        _id: 0,
                        notingHeading: 1,
                        pr_number: 1,
                        rfqInfo: 1,
                        items: 1,
                        committeeChairmanInfo: "$committeeInfo",
                        initiator: {
                            $cond: {
                                if: {
                                    $eq: ["$projectionNotingHierarchy.dd_ds.initiator", true]
                                },
                                then: {
                                    name_bn: "$projectionNotingHierarchy.dd_ds.name_bn",
                                    designation_bn: "$projectionNotingHierarchy.dd_ds.designation_bn",
                                },
                                else:
                                {
                                    name_bn: "$projectionNotingHierarchy.ad_ds.name_bn",
                                    designation_bn: "$projectionNotingHierarchy.ad_ds.designation_bn",
                                },
                            }
                        },
                        File_Index: 1
                    }
                }
            ]

            const result = await procurementCollection.aggregate(aggregationPipeline).toArray();

            if (result.length > 0) {
                return NextResponse.json(result[0])
            }
            else {
                return NextResponse.json({ message: "No document found with the given PR number" })
            }
        }
        else {
            return NextResponse.json({ message: "PR number is required" })

        }

    } catch (error) {
        console.error('Error to get document:', error); // Log error
        return NextResponse.json({ error: 'Failed to get document' }, { status: 500 });
    }
}