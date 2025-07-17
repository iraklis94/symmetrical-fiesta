# Wine Roulette Implementation Guide

## Overview
The Group Wine Roulette feature has been successfully implemented in the GreekMarket app. This feature allows groups of friends to collaboratively select wines through a fun voting process.

## Feature Flow
1. **Create/Join Session**: Users can create a new session or join an existing one with a 6-digit code
2. **Set Parameters**: Host selects region and optional filters (price range, minimum rating)
3. **Spin**: Host initiates the spin to randomly select 4 candidate wines
4. **Vote**: All participants vote thumbs up/down on each candidate
5. **Results**: Winner is revealed based on net votes, with options to find nearby stores

## Technical Implementation

### Backend (Convex)
- **Schema**: Added 3 new tables
  - `sessions`: Stores session metadata, participants, and status
  - `candidateWines`: Links sessions to randomly selected wines
  - `votes`: Records individual user votes

- **Functions**: Created in `/convex/roulette/`
  - `createSession.ts`: Creates new session with unique 6-digit code
  - `joinSession.ts`: Allows users to join existing sessions
  - `spinSession.ts`: Randomly selects wines based on filters
  - `castVote.ts`: Records user votes
  - `finalizeSession.ts`: Tallies votes and determines winner
  - `getSession.ts`: Real-time session data query
  - `getCandidates.ts`: Real-time candidate wines with vote counts

### Frontend (React Native)
- **Components**: Created in `/src/components/roulette/`
  - `RouletteHome.tsx`: Entry point with create/join options
  - `SessionLobby.tsx`: Waiting room showing participants
  - `WineCard.tsx`: Individual wine display with voting buttons
  - `VotingScreen.tsx`: Grid of candidates for voting
  - `ResultScreen.tsx`: Winner announcement with action buttons

- **Routes**: Added in `/app/roulette/`
  - `/roulette`: Home screen for Wine Roulette
  - `/roulette/session/[id]`: Dynamic route for active sessions

### Key Features
- **Real-time Updates**: All participants see live vote counts and status changes
- **Session Management**: Unique codes, host controls, participant tracking
- **Smart Filtering**: Wines filtered by region, price, and rating
- **Social Integration**: Share session codes, see participant avatars
- **Map Integration**: "Find Nearby" button connects to existing map functionality

## Usage Example
```typescript
// Create a session
const { sessionId, sessionCode } = await createSession({
  region: "Santorini",
  filters: {
    priceMin: 10,
    priceMax: 50,
    ratingMin: 4.0
  }
});

// Join a session
const { sessionId } = await joinSession({ 
  sessionCode: "123456" 
});

// Cast a vote
await castVote({
  sessionId,
  productId: "wine_123",
  upvote: true
});
```

## Next Steps
1. Add timer-based auto-finalization
2. Implement push notifications for session events
3. Add wine pairing suggestions for winners
4. Create session history/favorites
5. Add group chat during voting

## Integration Points
- **Clerk Auth**: User authentication and profiles
- **Mapbox**: Finding nearby stores with winning wine
- **Stripe**: Optional direct checkout for winning wine
- **Expo Location**: User location for nearby store search