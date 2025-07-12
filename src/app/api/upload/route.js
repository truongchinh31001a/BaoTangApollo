import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth.js';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
    const user = requireAuth(req);
    if (user instanceof Response) return user;

    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    const form = await req.formData();
    const file = form.get('file');
    const customFolder = form.get('folder') || ''; // Optional

    if (!file || typeof file === 'string') {
        return NextResponse.json({ error: 'File missing or invalid' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const resourceType = detectResourceType(file.type); // image/video/raw
    const folder = customFolder || resourceType; // Default folder by type

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: resourceType,
            },
            (error, result) => {
                if (error) {
                    resolve(NextResponse.json({ error: error.message }, { status: 500 }));
                } else {
                    resolve(NextResponse.json({
                        url: result.secure_url,
                        resource_type: result.resource_type,
                        format: result.format,
                        public_id: result.public_id
                    }));
                }
            }
        );
        stream.end(buffer);
    });
}

// Helper: Guess type
function detectResourceType(mime) {
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('video/')) return 'video';
    return 'raw'; // audio or others
}
