# Wine Roulette Feature Documentation

## Overview

Wine Roulette is a social feature that allows groups of friends to democratically select wines for their gatherings. Users can create or join sessions, spin to get random wine selections from specific Greek regions, vote on their favorites, and find nearby stores carrying the winning wine.

## User Flow

### 1. Create or Join Session
- **Create Session**: Users select a Greek wine region and optional filters (price range, minimum rating)
- **Join Session**: Users enter a 6-digit code to join a friend's session
- Session codes are shareable via native share functionality

### 2. Session Lobby
- Displays session code prominently for easy sharing
- Shows all participants with host designation
- Lists session parameters (region, filters)
- Host can start the spin when ready

### 3. Spin & Selection
- Animated spinning wheel while wines are being selected
- Backend randomly selects 4 wines matching the criteria
- Real-time updates for all participants

### 4. Voting Phase
- Each participant votes 👍 or 👎 on each wine candidate
- Live vote tallies update in real-time
- Progress bar shows overall voting completion
- Auto-advances when all votes are cast

### 5. Results & Actions
- Winner announcement with confetti animation
- Shows vote percentages and final tallies
- Options to:
  - Find nearby stores on map
  - Add to cart
  - Share the pick
  - Start a new session

## Technical Implementation

### Backend (Convex)

#### Data Models
```typescript
// Session tracking
sessions: {
  hostUserId: string
  sessionCode: string (6-digit)
  region: string
  filters: { priceMin?, priceMax?, ratingMin? }
  participantIds: string[]
  status: "pending" | "voting" | "complete"
  winnerId?: productId
}

// Wine candidates
candidateWines: {
  sessionId: id
  productId: id
  order: number
}

// Voting records
votes: {
  sessionId: id
  productId: id
  userId: string
  upvote: boolean
}
```

#### Key Functions
- `createSession`: Generates unique 6-digit code, initializes session
- `joinSession`: Adds user to participant list
- `spinSession`: Randomly selects wines based on criteria
- `castVote`: Records user votes with duplicate prevention
- `getSession`: Real-time subscription for session updates
- `finalizeSession`: Tallies votes and determines winner

### Frontend Components

#### RouletteScreen (`app/roulette/index.tsx`)
- Main orchestrator component
- Manages navigation between different phases
- Handles session state and real-time updates

#### CreateSessionScreen
- Region selection with 6 Greek wine regions
- Optional filters for price and rating
- Visual region cards with descriptions

#### JoinSessionScreen
- 6-digit code input with numeric keyboard
- Error handling for invalid/expired codes
- Auto-focus for better UX

#### SessionLobbyScreen
- Displays session code with copy/share functionality
- Shows participant list with avatars
- Host controls to start spin

#### SpinScreen
- Animated spinning wheel with wine emojis
- Loading state while backend selects wines
- Fun facts about the selected region

#### VotingScreen
- Wine cards with product details
- Thumbs up/down voting buttons
- Real-time vote count updates
- Progress tracking

#### ResultScreen
- Winner announcement with animations
- Vote statistics and percentages
- Integration with map for store finding
- Options to share or start new session

## Integration Points

### Map Integration
- Results screen navigates to map with wine filter
- Passes productId and productName as params
- Shows nearby stores carrying the winning wine

### Cart Integration
- Direct "Add to Cart" from results
- Uses existing cart store functionality

### Social Features
- Native share for session codes
- Share winning wine selection
- Real-time participant tracking

## Future Enhancements

1. **Wine Education**
   - Tasting notes for candidates
   - Food pairing suggestions
   - Region information cards

2. **Session History**
   - Save past sessions and winners
   - "Favorite Picks" collection
   - Re-run previous sessions

3. **Advanced Filters**
   - Grape variety selection
   - Wine type (red/white/rosé)
   - Specific producer preferences

4. **Gamification**
   - Streak tracking for group sessions
   - Achievement badges
   - Wine knowledge quizzes

5. **Authentication**
   - Integrate with Clerk for user profiles
   - Persistent session history
   - Friend lists for easy invites

## Configuration

### Environment Variables
No additional environment variables required - uses existing Convex setup.

### Dependencies
All functionality uses existing project dependencies:
- React Native/Expo
- Convex for real-time backend
- React Navigation for routing
- Expo Location for map integration

## Testing Recommendations

1. **Multi-user Testing**
   - Test with multiple devices/simulators
   - Verify real-time vote updates
   - Check session state synchronization

2. **Edge Cases**
   - No wines found for criteria
   - Network disconnection during voting
   - Session expiration handling

3. **Performance**
   - Large participant groups (10+)
   - Rapid vote submissions
   - Animation performance on older devices