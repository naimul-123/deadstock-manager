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
        const outwordNo = searchParams.get("outwordNo")
        const currentYear = new Date().getFullYear();
        const startDateStr = `${currentYear}-01-01`;
        const endDateStr = `${currentYear + 1}-01-01`;
        // let query = { pr_number: { $exists: true }, committeeInfo: { $exists: true }, rfqInfo: { $exists: true } }

        if (!outwordNo) {
            return NextResponse.json({ error: "Outword no required." })
        }
        const query = {
            'rfqInfo.outword_date': {
                $gte: startDateStr,
                $lt: endDateStr
            },
            'rfqInfo.vendors': {
                $elemMatch: { outword_no: outwordNo }
            }
        }
        const count = await procurementCollection.countDocuments(query)

        return NextResponse.json(count)
    } catch (error) {
        console.error('Error to get document:', error); // Log error
        return NextResponse.json({ error: 'Failed to get query' }, { status: 500 });
    }
}