import { NextRequest, NextResponse } from 'next/server';
import { GeminiQdrantService } from '@/lib/qdrant-client';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Only CSV files are allowed' },
        { status: 400 }
      );
    }

    // Read the CSV file
    const csvText = await file.text();
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Parse CSV data
    const products = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim());
        const product: any = {};
        
        headers.forEach((header, index) => {
          product[header] = values[index] || '';
        });
        
        // Create a searchable text from product data
        const searchableText = Object.values(product).join(' ');
        product.searchableText = searchableText;
        
        products.push(product);
      }
    }

    // Convert to documents for indexing
    const documents = products.map((product, index) => ({
      id: index + 1,
      text: product.searchableText,
      metadata: product
    }));

    // Index documents in Qdrant
    const service = new GeminiQdrantService();
    await service.batchIndexDocuments(documents);

    return NextResponse.json({
      message: 'CSV uploaded and indexed successfully',
      productsCount: products.length
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process CSV file' },
      { status: 500 }
    );
  }
} 