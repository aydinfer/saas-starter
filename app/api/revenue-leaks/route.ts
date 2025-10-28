import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const organizationId = searchParams.get('organizationId');
  const days = parseInt(searchParams.get('days') || '90');

  if (!organizationId) {
    return NextResponse.json(
      { error: 'organizationId required' },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Query revenue_leak_detections table
    const { data, error } = await supabase
      .from('revenue_leak_detections')
      .select('created_at, leak_type, estimated_impact, severity')
      .eq('organization_id', organizationId)
      .eq('is_resolved', false)
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch revenue leaks' },
        { status: 500 }
      );
    }

    // Group by date and leak_type for stacked area chart
    const groupedData = data.reduce((acc, leak) => {
      const date = new Date(leak.created_at).toISOString().split('T')[0];
      const key = `${date}-${leak.leak_type}`;

      if (!acc[key]) {
        acc[key] = {
          date,
          leak_type: leak.leak_type,
          total_impact: 0,
          count: 0,
          max_severity: leak.severity
        };
      }

      acc[key].total_impact += leak.estimated_impact || 0;
      acc[key].count += 1;

      return acc;
    }, {} as Record<string, any>);

    const chartData = Object.values(groupedData);

    // Calculate summary stats
    const summary = {
      totalLeakAmount: data.reduce((sum, leak) => sum + (leak.estimated_impact || 0), 0),
      totalLeaks: data.length,
      leaksByType: data.reduce((acc, leak) => {
        acc[leak.leak_type] = (acc[leak.leak_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      criticalLeaks: data.filter(l => l.severity === 'critical').length
    };

    return NextResponse.json({
      success: true,
      data: chartData,
      summary
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
