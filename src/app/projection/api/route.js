import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/../lib/mongodb";
import { ObjectId } from "mongodb";
export async function POST(request) {
    try {
        const client = await clientPromise;
        const db = client.db('deadstock');
        const procurementCollection = db.collection('procurements')
        const data = await request.json();
        const result = await procurementCollection.insertOne(data)
        return NextResponse.json({ message: 'Document inserted', result })
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
//             const procurementCollection = db.collection('procurements')
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
        const procurementCollection = db.collection('procurements')
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get("id")
        // console.log(id);
        let query = { pr_number: { $exists: false } };
        let result;
        if (id) {
            query._id = new ObjectId(id)
            result = await procurementCollection.findOne(query);
        }
        else {
            result = await procurementCollection.find(query).toArray();
        }


        return NextResponse.json(result)
    } catch (error) {
        console.error('Error to get document:', error); // Log error
        return NextResponse.json({ error: 'Failed to get document' }, { status: 500 });
    }
}