import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/../lib/mongodb";
import { ObjectId } from "mongodb";
export async function POST(request) {
    try {
        const client = await clientPromise;
        const db = client.db('deadstock');
        const hierarchyCollection = db.collection('hierarchy')
        const data = await request.json();
        const filter = {};
        const update = { $set: data }

        const result = await hierarchyCollection.updateOne(filter, update, { upsert: true })
        return NextResponse.json({ message: 'Document updated', result })
    } catch (error) {
        console.error('Error inserting document:', error); // Log error
        return NextResponse.json({ error: 'Failed to insert document' }, { status: 500 });
    }
}

// export default async function POST(request, res) {
//     console.log("request", request);
//     if (req.method === 'POST') {
//         try {
//             const client = await clientPromise;
//             const db = client.db('deadstock');
//             const rementCollection = db.collection('procurements')
//             const data = req.body;
//             console.log(data);
//             // return
//             const result = await procurementCollection.insertOne(req.body)
//             res.status(201).json(result)
//         } catch (e) {
//             console.error(e);
//             res.status(500).json({ message: 'Internal server error' })
//         }
//     }
//     else {
//         res.setHeader('Allow', ['POST']);
//         res.status(405).end(`Method ${req.method} not allowed.`)
//     }
// }
export async function GET(request) {

    try {

        const client = await clientPromise;
        const db = client.db('deadstock');
        const hierarchyCollection = db.collection('hierarchy')
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")
        // console.log(id);

        const result = await hierarchyCollection.find().toArray();



        return NextResponse.json(result[0])
    } catch (error) {
        console.error('Error to get document:', error); // Log error
        return NextResponse.json({ error: 'Failed to get document' }, { status: 500 });
    }
}