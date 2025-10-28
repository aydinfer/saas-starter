import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Save to waitlist table (you'll need to create this table in Supabase)
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        {
          email,
          created_at: new Date().toISOString(),
          source: 'landing_page'
        }
      ])
      .select();

    if (error) {
      console.error('Waitlist signup error:', error);

      // If table doesn't exist yet, just log it for now
      if (error.code === '42P01') {
        console.log('Waitlist table not created yet - email:', email);
        return NextResponse.json({
          success: true,
          message: 'Email saved (logged until DB setup)',
          email
        });
      }

      return NextResponse.json(
        { error: 'Failed to save email', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully joined waitlist',
      data
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
