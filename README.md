# E-commerce Recommendation System

A modern AI-powered product recommendation system built with Next.js, Qdrant vector database, and Google Gemini embeddings.

## Features

- 📁 **CSV Upload**: Upload product data via CSV files with drag-and-drop interface
- 🔍 **AI-Powered Search**: Natural language product search using semantic embeddings
- 📊 **Match Percentages**: See how well products match your search queries
- ⚡ **Fast Vector Search**: Powered by Qdrant for lightning-fast similarity matching
- 🎨 **Modern UI**: Beautiful, responsive interface with real-time feedback

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Vector Database**: Qdrant
- **AI Embeddings**: Google Gemini AI
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ 
- Qdrant database running (via Docker or local installation)
- Google Gemini API key

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your_qdrant_api_key_optional
```

### 3. Start Qdrant Database

Using Docker (recommended):

```bash
docker run -p 6333:6333 qdrant/qdrant
```

Or using the provided docker-compose:

```bash
docker-compose up -d
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### 1. Upload Product Data

1. Navigate to the "Upload Data" tab
2. Drag and drop a CSV file or click to browse
3. The system will automatically process and index your products

**CSV Format:**
```csv
product_name,description,price,category,brand,rating
Wireless Headphones,High-quality wireless headphones with noise cancellation,89.99,Electronics,SoundTech,4.5
```

### 2. Search Products

1. Switch to the "Search Products" tab
2. Enter your search query in natural language
3. View results with match percentages
4. Explore product details and metadata

**Example Searches:**
- "wireless headphones under $100"
- "organic coffee beans"
- "gaming laptop with good graphics"
- "fitness equipment for home"

## API Endpoints

### POST /api/upload
Upload and index CSV product data.

**Request:** FormData with CSV file
**Response:** 
```json
{
  "message": "CSV uploaded and indexed successfully",
  "productsCount": 20
}
```

### POST /api/search
Search for products using natural language.

**Request:**
```json
{
  "query": "wireless headphones",
  "limit": 10
}
```

**Response:**
```json
{
  "query": "wireless headphones",
  "recommendations": [
    {
      "id": 1,
      "score": 95,
      "text": "Wireless Bluetooth Headphones High-quality wireless headphones with noise cancellation and 30-hour battery life",
      "metadata": {
        "product_name": "Wireless Bluetooth Headphones",
        "description": "High-quality wireless headphones with noise cancellation and 30-hour battery life",
        "price": "89.99",
        "category": "Electronics",
        "brand": "SoundTech",
        "rating": "4.5"
      }
    }
  ],
  "totalResults": 1
}
```

## Sample Data

A sample CSV file (`sample-products.csv`) is included with 20 ecommerce products for testing.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Next.js API   │    │   Qdrant DB     │
│   (React)       │◄──►│   (TypeScript)  │◄──►│   (Vector DB)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Gemini AI     │
                       │   (Embeddings)  │
                       └─────────────────┘
```

## Development

### Project Structure

```
ecom-rec/
├── app/
│   ├── api/
│   │   ├── upload/route.ts    # CSV upload endpoint
│   │   └── search/route.ts    # Search endpoint
│   ├── page.tsx               # Main application page
│   └── layout.tsx             # App layout
├── components/
│   ├── FileUpload.tsx         # CSV upload component
│   └── ProductSearch.tsx      # Search interface component
├── lib/
│   └── qdrant-client.ts       # Qdrant service wrapper
└── sample-products.csv        # Sample product data
```

### Key Components

- **GeminiQdrantService**: Handles AI embeddings and vector database operations
- **FileUpload**: Drag-and-drop CSV upload with progress feedback
- **ProductSearch**: Natural language search with match percentage display

## Troubleshooting

### Common Issues

1. **Qdrant Connection Error**
   - Ensure Qdrant is running on port 6333
   - Check `QDRANT_URL` in environment variables

2. **Gemini API Error**
   - Verify your `GEMINI_API_KEY` is valid
   - Check API quota and billing status

3. **CSV Upload Fails**
   - Ensure CSV format is correct (headers in first row)
   - Check file size (recommended < 10MB)

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
