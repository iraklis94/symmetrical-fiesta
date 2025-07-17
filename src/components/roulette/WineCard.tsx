import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

interface WineCardProps {
  wine: {
    productId: Id<"products">;
    name: string;
    nameEn: string;
    brand: string;
    region: string;
    country: string;
    images: string[];
    avgRating: number;
    wineData?: {
      type: string;
      grapeVariety: string[];
      vintage: number;
      alcoholContent: number;
    };
    upvotes: number;
    downvotes: number;
    userVote?: boolean;
    netVotes: number;
  };
  sessionId: Id<"sessions">;
  votingEnabled: boolean;
}

export default function WineCard({ wine, sessionId, votingEnabled }: WineCardProps) {
  const castVote = useMutation(api.roulette.castVote);
  const [isVoting, setIsVoting] = React.useState(false);

  const handleVote = async (upvote: boolean) => {
    if (!votingEnabled || isVoting) return;

    try {
      setIsVoting(true);
      await castVote({
        sessionId,
        productId: wine.productId,
        upvote,
      });
    } catch (error) {
      console.error('Error casting vote:', error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <View className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
      <View className="relative">
        <Image
          source={{ uri: wine.images[0] || 'https://via.placeholder.com/300x400' }}
          className="w-full h-48"
          resizeMode="cover"
        />
        <View className="absolute top-4 right-4 bg-black/70 rounded-full px-3 py-1">
          <Text className="text-white font-medium">{wine.avgRating.toFixed(1)}★</Text>
        </View>
      </View>

      <View className="p-4">
        <Text className="text-xl font-bold text-gray-800" numberOfLines={1}>
          {wine.name}
        </Text>
        <Text className="text-gray-600 mb-1">{wine.brand}</Text>
        <Text className="text-gray-500 text-sm mb-3">
          {wine.region}, {wine.country}
        </Text>

        {wine.wineData && (
          <View className="flex-row flex-wrap gap-2 mb-4">
            <View className="bg-purple-100 rounded-full px-3 py-1">
              <Text className="text-purple-800 text-xs font-medium">
                {wine.wineData.type}
              </Text>
            </View>
            <View className="bg-purple-100 rounded-full px-3 py-1">
              <Text className="text-purple-800 text-xs font-medium">
                {wine.wineData.vintage}
              </Text>
            </View>
            <View className="bg-purple-100 rounded-full px-3 py-1">
              <Text className="text-purple-800 text-xs font-medium">
                {wine.wineData.alcoholContent}% ABV
              </Text>
            </View>
          </View>
        )}

        {votingEnabled && (
          <View className="flex-row items-center justify-between border-t border-gray-100 pt-4">
            <TouchableOpacity
              onPress={() => handleVote(true)}
              disabled={isVoting}
              className={`flex-1 flex-row items-center justify-center p-3 rounded-lg mr-2 ${
                wine.userVote === true
                  ? 'bg-green-500'
                  : 'bg-gray-100'
              }`}
            >
              {isVoting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="thumb-up"
                    size={20}
                    color={wine.userVote === true ? 'white' : '#4b5563'}
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      wine.userVote === true ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {wine.upvotes}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleVote(false)}
              disabled={isVoting}
              className={`flex-1 flex-row items-center justify-center p-3 rounded-lg ml-2 ${
                wine.userVote === false
                  ? 'bg-red-500'
                  : 'bg-gray-100'
              }`}
            >
              {isVoting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="thumb-down"
                    size={20}
                    color={wine.userVote === false ? 'white' : '#4b5563'}
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      wine.userVote === false ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {wine.downvotes}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {!votingEnabled && (wine.upvotes > 0 || wine.downvotes > 0) && (
          <View className="border-t border-gray-100 pt-4">
            <View className="flex-row items-center justify-center">
              <Text className="text-gray-600 mr-4">
                👍 {wine.upvotes}
              </Text>
              <Text className="text-gray-600">
                👎 {wine.downvotes}
              </Text>
              <Text className="text-gray-800 font-semibold ml-4">
                Net: {wine.netVotes > 0 ? '+' : ''}{wine.netVotes}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}