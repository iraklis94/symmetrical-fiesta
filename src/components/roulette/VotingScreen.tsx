import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import WineCard from './WineCard';

interface VotingScreenProps {
  session: any;
  sessionId: Id<"sessions">;
  onComplete: () => void;
}

export default function VotingScreen({ session, sessionId, onComplete }: VotingScreenProps) {
  const { user } = useUser();
  const candidates = useQuery(api.roulette.getCandidates, { sessionId });
  const finalizeSession = useMutation(api.roulette.finalizeSession);
  const [isFinalizing, setIsFinalizing] = React.useState(false);

  const isHost = user?.id === session.hostUserId;

  const handleFinalize = async () => {
    try {
      setIsFinalizing(true);
      await finalizeSession({ sessionId });
      onComplete();
    } catch (error) {
      console.error('Error finalizing session:', error);
    } finally {
      setIsFinalizing(false);
    }
  };

  if (!candidates) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  // Check if all participants have voted
  const totalPossibleVotes = session.participants.length * candidates.length;
  const totalVotesCast = candidates.reduce(
    (sum, wine) => sum + wine.upvotes + wine.downvotes,
    0
  );
  const allVoted = totalVotesCast >= totalPossibleVotes;

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white shadow-sm px-6 py-4 mb-2">
        <Text className="text-2xl font-bold text-gray-800">Vote for Your Favorites</Text>
        <Text className="text-gray-600 mt-1">
          {candidates.length} wines selected from {session.region}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16 }}
      >
        {candidates.map((wine) => (
          <WineCard
            key={wine.productId}
            wine={wine}
            sessionId={sessionId}
            votingEnabled={session.status === 'voting'}
          />
        ))}
      </ScrollView>

      {isHost && session.status === 'voting' && (
        <View className="bg-white shadow-lg px-6 py-4">
          <TouchableOpacity
            onPress={handleFinalize}
            disabled={isFinalizing}
            className={`rounded-lg p-4 ${
              allVoted ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            {isFinalizing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                {allVoted
                  ? 'Reveal Winner'
                  : `Waiting for votes (${totalVotesCast}/${totalPossibleVotes})`}
              </Text>
            )}
          </TouchableOpacity>
          
          {!allVoted && (
            <TouchableOpacity
              onPress={handleFinalize}
              disabled={isFinalizing}
              className="mt-2 p-3"
            >
              <Text className="text-purple-600 text-center">
                End voting early
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {!isHost && session.status === 'voting' && (
        <View className="bg-white shadow-lg px-6 py-4">
          <View className="bg-gray-100 rounded-lg p-4">
            <Text className="text-gray-700 text-center">
              {allVoted
                ? 'All votes are in! Waiting for host to reveal winner...'
                : `Votes cast: ${totalVotesCast}/${totalPossibleVotes}`}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}