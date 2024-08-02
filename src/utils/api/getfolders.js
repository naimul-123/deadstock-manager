import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const folderPath = path.join(process.cwd(), 'purchase_requisition');

    try {
        const items = fs.readdirSync(folderPath);
        const folders = items.filter(item => {
            const itemPath = path.join(folderPath, item);
            return fs.statSync(itemPath).isDirectory();
        });
        res.status(200).json(folders);
    } catch (error) {
        res.status(500).json({ error: 'Error reading directory' });
    }
}