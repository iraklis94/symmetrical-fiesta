iOS App Documentation

Introduction

This document provides an overview of an iOS application developed using Expo, with Stripe for payment processing and Convex as the backend. The app integrates a Mapbox map to display nearby supermarkets and allows users to rate wine, cheese, and olive oil. It fetches real-time product data through APIs and offers a user experience similar to Wolt, customized for the Greek market. A key feature is the ability to select a product first, followed by dynamic filtering options.

Purpose

The app is designed to:





Help users locate nearby supermarkets using a map interface.



Enable rating and reviewing of wine, cheese, and olive oil.



Provide real-time product information via external APIs.



Offer a seamless product selection and filtering process.



Technology Stack





Expo: A React Native framework for building and deploying the iOS app.



Stripe: Handles secure payment processing within the app.



Convex: Manages backend operations, including data storage and real-time updates.



Mapbox: Powers the map feature to display nearby supermarkets.



Features

1. Map View





Description: Displays a map showing nearby supermarkets based on the user’s location.



Implementation: Uses the Mapbox SDK integrated with Expo for map rendering and geolocation.

2. Rating System





Description: Allows users to rate and review wine, cheese, and olive oil.



Details: Features a star-based rating system and an optional text review field.



Storage: Ratings and reviews are stored in Convex, linked to products and users.

3. Real-time Data





Description: Fetches up-to-date product data, such as availability and pricing.



Implementation: External APIs are accessed via Convex functions for secure and efficient data retrieval.

4. Product Selection and Filtering





Description: Users select a product category first (e.g., wine, cheese, olive oil), then apply filters.



Filters: Options include price range, brand, or rating, tailored to the selected category.



Flow: Filtering options are dynamically displayed after product selection.



User Flow





Open App: Users see a Mapbox map displaying nearby supermarkets.



Choose Product: Select a category (wine, cheese, or olive oil).



Filter Options: Apply filters like price or rating based on the chosen category.



View Products: Browse filtered results with details and rating options.



Rate Product: Submit ratings and reviews, saved to Convex.



Purchase (Optional): Use Stripe for secure payment processing.



Payment Integration





Tool: Stripe, integrated via its Expo-compatible SDK.



Functionality: Processes payments securely for any in-app purchases.



Security: Payment data is handled by Stripe, with no sensitive information stored locally.



Backend with Convex





Role: Manages user authentication, product data, and ratings.



Real-time: Ensures product and rating data are updated instantly.



API Handling: External product APIs are called through Convex for scalability and security.



Localization





Target Market: Tailored for Greece with Greek language support and localized content.



Details: Prices in Euros, measurements in metric units, and region-specific product data.



Future Enhancements





Enhanced Filters: Add options like dietary preferences or product origin.



Social Sharing: Enable users to share ratings or favorite products.



Subscriptions: Introduce premium features via Stripe subscriptions.



More Categories: Expand beyond wine, cheese, and olive oil.



This documentation provides a foundation for developing and understanding the app. For detailed technical guidance, consult the Expo, Stripe, Convex, and Mapbox documentation.