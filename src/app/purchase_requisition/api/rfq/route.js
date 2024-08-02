import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/../lib/mongodb";
import { ObjectId } from "mongodb";
const client = await clientPromise;
const db = client.db('deadstock');
const procurementCollection = db.collection('procurements')
export async function PUT(request) {
    try {

        const { id, pr_number, projectionApproveInfo, prNotingHierarchy } = await request.json();
        const count = await procurementCollection.countDocuments({ pr_number: pr_number })
        if (count === 0) {
            const result = await procurementCollection.updateOne({
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
        const searchParams = request.nextUrl.searchParams;
        const pr = searchParams.get("pr")
        let query = { pr_number: { $exists: true }, committeeInfo: { $exists: true }, vendors: { $exists: true } }
        let result
        const options = { projection: { pr_number: 1, _id: 0, vendors: 1 } }
        if (pr) {
            query.pr_number = pr
            result = await procurementCollection.findOne(query, options);
        }
        return NextResponse.json(result)
    } catch (error) {
        console.error('Error to get document:', error); // Log error
        return NextResponse.json({ error: 'Failed to get document' }, { status: 500 });
    }
}