import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";
export async function POST(request) {
    try {
        const client = await clientPromise;
        const db = client.db('deadstock');
        const procurementCollection = db.collection('procurements')
        const { data } = await request.json();
        const result = await procurementCollection.insertOne(data)
        return NextResponse.json({ message: 'Document inserted', result })
    } catch (error) {
        console.error('Error inserting document:', error); // Log error
        return NextResponse.json({ error: 'Failed to insert document' }, { status: 500 });
    }
}
export async function GET(request) {
    try {

        const client = await clientPromise;
        const db = client.db('deadstock');
        const procurementCollection = db.collection('procurements')
        // const searchParams = request.nextUrl.searchParams;
        // const query = searchParams.get("query")
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');
        let query = {};
        if (id) {
            query = { _id: new ObjectId(id) }
        }
        let result;
        if (id) {
            result = await procurementCollection.findOne(query);
        }
        else {
            request = result = await procurementCollection.find().toArray();
        }


        return NextResponse.json(result)
    } catch (error) {
        console.error('Error inserting document:', error); // Log error
        return NextResponse.json({ error: 'Failed to insert document' }, { status: 500 });
    }
}