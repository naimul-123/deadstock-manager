// app/api/convert/route.js
import { NextResponse } from 'next/server';
import { DocxPdf } from 'docx-pdf';
import { Buffer } from 'buffer';

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, we'll handle it manually
    },
};

const parseFormData = async (req) => {
    const reader = req.body.getReader();
    console.log(reader);
    const decoder = new TextDecoder();
    let data = '';
    let done = false;

    while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        data += decoder.decode(value, { stream: !done });
    }

    return data;
};

export async function POST(req) {
    try {
        const rawData = await parseFormData(req);
        const boundary = req.headers.get('content-type').split('boundary=')[1];
        const parts = rawData.split(boundary).slice(1, -1);

        const filePart = parts.find(part => part.includes('Content-Disposition: form-data; name="file";'));
        const fileContent = filePart.split('\r\n\r\n')[1].split('\r\n--')[0];
        const docBuffer = Buffer.from(fileContent, 'binary');

        const pdfBuffer = await DocxPdf.convert(docBuffer);

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=document.pdf',
            },
        });
    } catch (error) {
        console.error('Error converting DOCX to PDF:', error);
        return new NextResponse('Error converting DOCX to PDF', { status: 500 });
    }
}
