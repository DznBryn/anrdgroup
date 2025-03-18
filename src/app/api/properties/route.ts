import { NextResponse } from 'next/server';
import { createProperty, getAllProperties } from '@/utils/api/mongodb';

export async function POST(req: Request) {
  try {
    const property = await req.json();
    console.log('something', property);
    const result = await createProperty(property);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to add property' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const result = await getAllProperties(page, limit);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to get properties' }, { status: 500 });
  }
}


