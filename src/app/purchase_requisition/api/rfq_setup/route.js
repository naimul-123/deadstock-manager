import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/../lib/mongodb";
import { ObjectId } from "mongodb";
const client = await clientPromise;
const db = client.db('deadstock');
const procurementCollection = db.collection('procurements')
export async function PUT(request) {
    try {

        const { pr_number, committeeInfo, rfqInfo } = await request.json();

        const query = { pr_number: pr_number }
        if (pr_number) {
            const result = await procurementCollection.updateOne(query, {
                $set: {
                    committeeInfo: committeeInfo,
                    rfqInfo: rfqInfo
                }
            })
            return NextResponse.json({ message: 'Rfq info has been updated successfully', result })
        }

    } catch (error) {
        console.error('Error inserting document:', error); // Log error
        return NextResponse.json({ error: 'Failed to insert document' }, { status: 500 });
    }
}

export async function GET(request) {

    try {
        const { searchParams } = new URL(request.url)
        const pr = searchParams.get("pr")
        let query = { pr_number: { $exists: true }, committeeInfo: { $exists: false } }
        let result
        const options = { projection: { pr_number: 1, _id: 0 } }
        if (pr) {
            query.pr_number = pr
            result = await procurementCollection.findOne(query);
        }
        else {
            result = await procurementCollection.find(query, options).toArray();
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error to get document:', error); // Log error
        return NextResponse.json({ error: 'Failed to get document' }, { status: 500 });
    }
}