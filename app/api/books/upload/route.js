import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function POST(request) {
  try {
    const token = request.headers.get('authorization');
    
    const formData = await request.formData();
    
    const response = await fetch(`${BACKEND_URL}/api/books/upload`, {
      method: 'POST',
      headers: {
        'Authorization': token || '',
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Upload failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Upload proxy error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}