import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { status: 400, message: 'No file uploaded', data: null },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = file.name.split('.').pop();
        const filename = `${uniqueSuffix}.${ext}`;

        // Ensure the upload directory exists
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore if directory already exists
        }

        const filePath = join(uploadDir, filename);
        await writeFile(filePath, buffer);

        // Return the public URL path
        const fileUrl = `/uploads/${filename}`;

        return NextResponse.json({
            status: 200,
            message: 'File uploaded successfully',
            data: { url: fileUrl }
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { status: 500, message: 'Internal server error during file upload', data: null },
            { status: 500 }
        );
    }
}
