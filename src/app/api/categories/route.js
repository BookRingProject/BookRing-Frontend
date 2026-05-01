import { NextResponse } from 'next/server';
import { CATEGORIES } from '../../../utils/constants';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization');
    
    const response = await fetch(`${BACKEND_URL}/api/categories`, {
      headers: {
        'Authorization': token || '',
      },
    });

    if (!response.ok) {
      // Fallback to local categories if backend fails
      return NextResponse.json({ categories: CATEGORIES }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Categories proxy error:', error);
    // Fallback to local categories
    return NextResponse.json({ categories: CATEGORIES }, { status: 200 });
  }
}
