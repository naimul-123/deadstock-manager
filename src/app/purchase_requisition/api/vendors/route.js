import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/../lib/mongodb";
import { ObjectId } from "mongodb";
const client = await clientPromise;
const db = client.db('deadstock');
const vendorsCollection = db.collection('vendors')
export async function PUT(request) {
    try {

        const { id, pr_number, projectionApproveInfo, prNotingHierarchy } = await request.json();
        const count = await vendorsCollection.countDocuments({ pr_number: pr_number })
        if (count === 0) {
            const result = await vendorsCollection.updateOne({
                _id: new ObjectId(id)
            }, {
                $set: {
                    pr_number: pr_number,
                    projectionApproveInfo: projectionApproveInfo,
                    prNotingHierarchy: prNotingHierarchy
                }
            })
            return NextResponse.json({ message: 'Document inserted', result })
        }
        else {
            return NextResponse.json({ message: 'This purchase requisition number already inserted in another projection. check and resubmit the purchase requisition number.' })
        }

    } catch (error) {
        console.error('Error inserting document:', error); // Log error
        return NextResponse.json({ error: 'Failed to insert document' }, { status: 500 });
    }
}

export async function GET(request) {

    try {
        const { searchParams } = new URL(request.url)
        const vendor_id = searchParams.get("vendor_id")
        if (vendor_id) {
            const query = { vendor_id: parseInt(vendor_id) }
            const result = await vendorsCollection.findOne(query, { projection: { _id: 0, vendor_name_en: 0, vendor_add_en: 0 } });
            return NextResponse.json(result)
        }

    } catch (error) {
        console.error('Error to get document:', error); // Log error
        return NextResponse.json({ error: 'Failed to get document' }, { status: 500 });
    }
}  