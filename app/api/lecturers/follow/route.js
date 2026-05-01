import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function POST(request) {
  try {
    const token = request.headers.get('authorization');
    const { lecturerId } = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/api/follows/${lecturerId}`, {
      method: 'POST',
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to follow lecturer' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Follow proxy error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const token = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    const lecturerId = searchParams.get('lecturerId');
    
    const response = await fetch(`${BACKEND_URL}/api/follows/${lecturerId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token || '',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to unfollow lecturer' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Unfollow proxy error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}