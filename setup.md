# Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Google Gemini API Key
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_google_gemini_api_key_here

# Qdrant Database Configuration
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your_qdrant_api_key_optional
```

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Qdrant database:**
   ```bash
   docker run -p 6333:6333 qdrant/qdrant
   ```

3. **Set up environment variables** (see above)

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to http://localhost:3000

## Testing the System

1. **Upload sample data:**
   - Go to "Upload Data" tab
   - Upload the included `sample-products.csv` file
   - Wait for processing to complete

2. **Search for products:**
   - Switch to "Search Products" tab
   - Try searches like:
     - "wireless headphones"
     - "coffee beans"
     - "gaming laptop"
     - "fitness equipment"

3. **View results:**
   - See product cards with images
   - Check match percentages
   - View product details and pricing 