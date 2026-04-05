import { NextRequest, NextResponse } from 'next/server';
import queryDb from '@/app/actions/query';

export async function GET(request: NextRequest) {
  try {
    const result = await queryDb();
    return NextResponse.json({
      success: true,
      message: 'queryDb executed successfully',
      result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to execute queryDb',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
