import { QdrantClient } from '@qdrant/js-client-rest';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Types
interface Document {
  id: number;
  text: string;
  metadata?: Record<string, any>;
}

interface SearchResult {
  id: number;
  score: number;
  text: string;
  metadata?: Record<string, any>;
}

// Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;

// Initialize clients
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const qdrantClient = new QdrantClient({
  url: QDRANT_URL,
  apiKey: QDRANT_API_KEY,
});

const COLLECTION_NAME = 'ecommerce_data';
const EMBEDDING_SIZE = 768; // Gemini embedding-001 size

// Utility class for Gemini + Qdrant operations
export class GeminiQdrantService {
  private model = genAI.getGenerativeModel({ model: 'embedding-001' });

  // Generate embedding for a single text
  async generateEmbedding(
    text: string, 
    taskType: 'retrieval_document' | 'retrieval_query' = 'retrieval_document'
  ): Promise<number[]> {
    try {
      const result = await this.model.embedContent(text);
      
      return result.embedding.values;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  // Create collection if it doesn't exist
  async initializeCollection(): Promise<void> {
    try {
      const collections = await qdrantClient.getCollections();
      const collectionExists = collections.collections.some(
        col => col.name === COLLECTION_NAME
      );

      if (!collectionExists) {
        await qdrantClient.createCollection(COLLECTION_NAME, {
          vectors: {
            size: EMBEDDING_SIZE,
            distance: 'Cosine',
          },
        });
        console.log(`Collection '${COLLECTION_NAME}' created successfully`);
      }
    } catch (error) {
      console.error('Error initializing collection:', error);
      throw new Error('Failed to initialize collection');
    }
  }

  // Index documents
  async indexDocuments(documents: Document[]): Promise<void> {
    try {
      await this.initializeCollection();

      const points = await Promise.all(
        documents.map(async (doc) => {
          const embedding = await this.generateEmbedding(doc.text, 'retrieval_document');
          
          return {
            id: doc.id,
            vector: embedding,
            payload: {
              text: doc.text,
              ...doc.metadata,
            },
          };
        })
      );

      await qdrantClient.upsert(COLLECTION_NAME, {
        wait: true,
        points,
      });

      console.log(`Indexed ${documents.length} documents`);
    } catch (error) {
      console.error('Error indexing documents:', error);
      throw new Error('Failed to index documents');
    }
  }

  // Search documents
  async searchDocuments(query: string, limit: number = 5): Promise<SearchResult[]> {
    try {
      const queryEmbedding = await this.generateEmbedding(query, 'retrieval_query');

      const searchResult = await qdrantClient.search(COLLECTION_NAME, {
        vector: queryEmbedding,
        limit,
        with_payload: true,
      });

      return searchResult.map((result) => ({
        id: result.id as number,
        score: result.score,
        text: result.payload?.text as string,
        metadata: result.payload || undefined,
      }));
    } catch (error) {
      console.error('Error searching documents:', error);
      throw new Error('Failed to search documents');
    }
  }

  // Batch processing for large datasets
  async batchIndexDocuments(documents: Document[], batchSize: number = 50): Promise<void> {
    try {
      await this.initializeCollection();

      for (let i = 0; i < documents.length; i += batchSize) {
        const batch = documents.slice(i, i + batchSize);
        await this.indexDocuments(batch);
        console.log(`Processed batch ${Math.floor(i / batchSize) + 1}`);
      }
    } catch (error) {
      console.error('Error in batch indexing:', error);
      throw new Error('Failed to batch index documents');
    }
  }
}
