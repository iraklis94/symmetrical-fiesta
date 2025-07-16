#!/bin/bash

echo "🚀 Setting up GreekMarket..."

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file. Please update it with your API keys."
else
    echo "ℹ️  .env file already exists."
fi

echo "📱 Installing Expo CLI globally..."
npm install -g expo-cli eas-cli

echo "🗄️ Setting up Convex..."
npx convex init

echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with your API keys"
echo "2. Run 'npm run convex:dev' to start Convex backend"
echo "3. Run 'npm start' to start the Expo development server"
echo ""
echo "Happy coding! 🎉" 