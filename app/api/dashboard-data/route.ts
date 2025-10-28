import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, organization_id } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id required' },
        { status: 400 }
      );
    }

    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('dashboard-ui-data', {
      body: {
        user_id,
        organization_id
      }
    });

    if (error) {
      console.error('Dashboard data function error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch dashboard data', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      ...data
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
