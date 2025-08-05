import { NextRequest, NextResponse } from 'next/server';
import { GeminiQdrantService } from '@/lib/qdrant-client';

export async function POST(request: NextRequest) {
  try {
    const { query, limit = 10 } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const service = new GeminiQdrantService();
    const results = await service.searchDocuments(query, limit);

    // Convert scores to percentages (0-100)
    const recommendations = results.map(result => ({
      id: result.id,
      score: Math.round(result.score * 100), // Convert to percentage
      text: result.text,
      metadata: result.metadata
    }));

    return NextResponse.json({
      query,
      recommendations,
      totalResults: recommendations.length
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
} 