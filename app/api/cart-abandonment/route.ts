import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      organizationId,
      analysisType = 'comprehensive',
      storeAnalytics
    } = body;

    if (!organizationId) {
      return NextResponse.json(
        { error: 'organizationId required' },
        { status: 400 }
      );
    }

    // Call Supabase Edge Function for cart abandonment analysis
    const { data, error } = await supabase.functions.invoke('cart-abandonment-analysis', {
      body: {
        organizationId,
        analysisType,
        storeAnalytics: storeAnalytics || {
          monthlyRevenue: 450000,
          averageOrderValue: 75,
          conversionRate: 2.5,
          cartAbandonmentRate: 68,
          mobileTrafficPercentage: 60
        }
      }
    });

    if (error) {
      console.error('Cart abandonment analysis error:', error);
      return NextResponse.json(
        { error: 'Failed to analyze cart abandonment', details: error.message },
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
