# 🚀 GreekMarket - Quick Start Guide

This guide will help you get the GreekMarket iOS app running on your local machine in minutes!

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **Xcode** (for iOS development)
- **iOS Simulator** or physical iOS device

## Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/iraklis94/symmetrical-fiesta.git
cd symmetrical-fiesta

# Run the setup script
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Or manually:

```bash
# Install dependencies
npm install

# Install Expo CLI globally
npm install -g expo-cli eas-cli
```

## Step 2: Configure Environment

1. Create your `.env` file:
```bash
cp .env.example .env
```

2. Update `.env` with your API keys:
```env
# Required keys:
EXPO_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
```

### Getting API Keys:

#### Convex (Backend)
1. Go to [convex.dev](https://convex.dev)
2. Create a new project
3. Copy your deployment URL
4. Run: `npx convex init` and select your project

#### Mapbox (Maps)
1. Go to [mapbox.com](https://mapbox.com)
2. Create a free account
3. Copy your default public token

#### Stripe (Payments)
1. Go to [stripe.com](https://stripe.com)
2. Create an account
3. Get your test publishable key

## Step 3: Start the Backend

In Terminal 1:
```bash
npm run convex:dev
```

This starts the Convex backend. Keep this terminal running!

## Step 4: Start the App

In Terminal 2:
```bash
npm start
```

This will open Expo Developer Tools in your browser.

## Step 5: Run on iOS Simulator

Press `i` in the terminal or click "Run on iOS simulator" in the browser.

## Step 6: Run on Physical Device

1. Install **Expo Go** from the App Store
2. Scan the QR code shown in terminal/browser
3. Make sure your phone and computer are on the same network

## 🎉 That's it!

The app should now be running with:
- 🏠 Home screen with product categories
- 🗺️ Map showing nearby stores (mock data initially)
- 🛒 Shopping cart functionality
- 📱 Product details and ratings

## Common Issues & Solutions

### "Metro bundler error"
```bash
# Clear cache and restart
npx expo start -c
```

### "Convex connection failed"
- Check your CONVEX_URL in .env
- Make sure `npm run convex:dev` is running

### "Mapbox map not showing"
- Verify your Mapbox token is correct
- Check internet connection

### "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## Next Steps

1. **Add Sample Data**: Run the seed script (when available)
2. **Customize**: Update colors, logos in `app.json`
3. **Test Features**: Try adding products to cart, viewing map
4. **Build for Production**: See `docs/SETUP_GUIDE.md`

## Project Structure

```
├── app/              # Expo Router screens
│   ├── (tabs)/      # Tab navigation screens
│   ├── product/     # Product detail screen
│   └── _layout.tsx  # Root layout
├── src/
│   ├── components/  # Reusable components
│   ├── hooks/       # Custom React hooks
│   └── stores/      # State management
├── convex/          # Backend functions
├── assets/          # Images, fonts, etc.
└── package.json     # Dependencies
```

## Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run convex:dev` - Start Convex backend
- `npm test` - Run tests
- `npm run lint` - Check code quality

## Need Help?

- 📖 Check the full documentation in `/docs`
- 🐛 Report issues on [GitHub](https://github.com/iraklis94/symmetrical-fiesta/issues)
- 💬 Join our Discord community (coming soon)

Happy coding! 🍷🧀🫒 