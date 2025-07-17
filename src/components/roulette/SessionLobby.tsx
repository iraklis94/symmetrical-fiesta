import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Share,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Id } from '../../../convex/_generated/dataModel';

interface SessionLobbyProps {
  session: any; // Session data from Convex
  sessionId: Id<"sessions">;
  onSpinComplete: () => void;
}

export default function SessionLobby({ session, sessionId, onSpinComplete }: SessionLobbyProps) {
  const { user } = useUser();
  const spinSession = useMutation(api.roulette.spinSession);
  const [isSpinning, setIsSpinning] = React.useState(false);

  const isHost = user?.id === session.hostUserId;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my Wine Roulette session! Code: ${session.sessionCode}`,
        title: 'Wine Roulette Invitation',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSpin = async () => {
    try {
      setIsSpinning(true);
      await spinSession({ sessionId });
      onSpinComplete();
    } catch (error) {
      console.error('Error spinning:', error);
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
        <View className="items-center mb-6">
          <Text className="text-3xl font-bold mb-2">{session.sessionCode}</Text>
          <Text className="text-gray-600">Session Code</Text>
        </View>

        <TouchableOpacity
          onPress={handleShare}
          className="bg-gray-100 rounded-lg p-3 flex-row items-center justify-center mb-4"
        >
          <MaterialCommunityIcons name="share-variant" size={20} color="#4b5563" />
          <Text className="text-gray-700 ml-2 font-medium">Share Code</Text>
        </TouchableOpacity>

        <View className="border-t border-gray-200 pt-4">
          <Text className="text-gray-700 font-medium mb-2">
            Region: {session.region}
          </Text>
          {session.filters.priceMin && (
            <Text className="text-gray-600">
              Min Price: €{session.filters.priceMin}
            </Text>
          )}
          {session.filters.priceMax && (
            <Text className="text-gray-600">
              Max Price: €{session.filters.priceMax}
            </Text>
          )}
          {session.filters.ratingMin && (
            <Text className="text-gray-600">
              Min Rating: {session.filters.ratingMin}★
            </Text>
          )}
        </View>
      </View>

      <View className="bg-white rounded-2xl p-6 shadow-lg flex-1">
        <Text className="text-xl font-bold mb-4">
          Participants ({session.participants.length})
        </Text>

        <View className="flex-1">
          {session.participants.map((participant: any, index: number) => (
            <View
              key={participant.id}
              className="flex-row items-center py-3 border-b border-gray-100"
            >
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                <Text className="text-purple-600 font-semibold">
                  {participant.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text className="flex-1 text-gray-800">
                {participant.name}
                {participant.id === session.hostUserId && (
                  <Text className="text-purple-600"> (Host)</Text>
                )}
              </Text>
            </View>
          ))}
        </View>

        {isHost && (
          <TouchableOpacity
            onPress={handleSpin}
            disabled={isSpinning || session.participants.length < 2}
            className={`rounded-lg p-4 mt-4 ${
              session.participants.length < 2
                ? 'bg-gray-300'
                : 'bg-purple-600'
            }`}
          >
            {isSpinning ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                {session.participants.length < 2
                  ? 'Waiting for more participants...'
                  : 'Start Spin'}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {!isHost && (
          <View className="bg-gray-100 rounded-lg p-4 mt-4">
            <Text className="text-gray-700 text-center">
              Waiting for host to start the spin...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}