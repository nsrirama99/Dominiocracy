#!/bin/bash

# Dominiocracy Setup Script

echo "🎮 Setting up Dominiocracy..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚠️  No .env.local file found!"
    echo ""
    echo "Please enter your Gemini API key (get one at https://ai.google.dev):"
    read -p "API Key: " api_key
    
    echo "GEMINI_API_KEY=$api_key" > .env.local
    echo "✅ Created .env.local file"
else
    echo "✅ .env.local file already exists"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the game, run: npm run dev"
echo "Then open http://localhost:3000"

