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
    // Query ga4_metrics table for channel attribution
    // This would come from the GA4 Edge Function in production
    const { data, error } = await supabase
      .from('ga4_metrics')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('metric_type', 'channel_attribution')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch channel performance data' },
        { status: 500 }
      );
    }

    // Transform data for grouped bar chart
    // Group by channel and aggregate metrics
    const channelMap: Record<string, {
      channel: string;
      sessions: number;
      conversions: number;
      revenue: number;
      conversionRate: number;
      leakScore: number;
    }> = {};

    data.forEach((record: any) => {
      const metrics = record.metrics || {};
      const channel = metrics.channel || 'Unknown';

      if (!channelMap[channel]) {
        channelMap[channel] = {
          channel,
          sessions: 0,
          conversions: 0,
          revenue: 0,
          conversionRate: 0,
          leakScore: 0
        };
      }

      channelMap[channel].sessions += metrics.sessions || 0;
      channelMap[channel].conversions += metrics.purchases || 0;
      channelMap[channel].revenue += metrics.revenue || 0;
    });

    // Calculate derived metrics
    const channelData = Object.values(channelMap).map(channel => ({
      ...channel,
      conversionRate: channel.sessions > 0
        ? (channel.conversions / channel.sessions) * 100
        : 0,
      leakScore: channel.sessions > 0
        ? ((channel.sessions - channel.conversions) / channel.sessions) * 100
        : 0
    }));

    return NextResponse.json({
      success: true,
      data: channelData,
      summary: {
        totalChannels: channelData.length,
        totalSessions: channelData.reduce((sum, c) => sum + c.sessions, 0),
        totalConversions: channelData.reduce((sum, c) => sum + c.conversions, 0),
        totalRevenue: channelData.reduce((sum, c) => sum + c.revenue, 0)
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
