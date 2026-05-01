import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function GET(request, { params }) {
  try {
    const token = request.headers.get('authorization');
    const { lecturerId } = params;
    
    const response = await fetch(`${BACKEND_URL}/api/lecturers/${lecturerId}`, {
      headers: {
        'Authorization': token || '',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch lecturer' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Fetch lecturer proxy error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}