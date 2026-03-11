import { NextRequest, NextResponse } from 'next/server';
import { MarketIntelligenceService, MarketIntelligenceError } from '../../../../lib/marketIntelligenceService';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ company: string }> }
) {
  const { company: rawCompany } = await params;

  if (!rawCompany) {
    return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
  }

  const company = decodeURIComponent(rawCompany);

  try {
    const data = await MarketIntelligenceService.getMarketIntelligence(company);
    return NextResponse.json(data, {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'private, max-age=600',
      },
    });
  } catch (err) {
    if (err instanceof MarketIntelligenceError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to fetch market intelligence' }, { status: 500 });
  }
}
