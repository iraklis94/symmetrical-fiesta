import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Id } from '../../../convex/_generated/dataModel';

interface ResultScreenProps {
  session: any;
  sessionId: Id<"sessions">;
  onReset: () => void;
}

export default function ResultScreen({ session, sessionId, onReset }: ResultScreenProps) {
  const router = useRouter();
  const candidates = useQuery(api.roulette.getCandidates, { sessionId });

  if (!candidates || !session.winnerId) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  const winner = candidates.find((c) => c.productId === session.winnerId);
  if (!winner) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-600">No winner found</Text>
      </View>
    );
  }

  // Sort candidates by net votes to show ranking
  const sortedCandidates = [...candidates].sort((a, b) => b.netVotes - a.netVotes);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-purple-600 pt-12 pb-8 px-6">
        <View className="items-center">
          <MaterialCommunityIcons name="trophy" size={64} color="white" />
          <Text className="text-white text-3xl font-bold mt-4">
            We Have a Winner!
          </Text>
        </View>
      </View>

      {/* Winner Card */}
      <View className="px-6 -mt-4">
        <View className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <Image
            source={{ uri: winner.images[0] || 'https://via.placeholder.com/400x300' }}
            className="w-full h-64"
            resizeMode="cover"
          />
          
          <View className="p-6">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              {winner.name}
            </Text>
            <Text className="text-lg text-gray-600 mb-1">{winner.brand}</Text>
            <Text className="text-gray-500 mb-4">
              {winner.region}, {winner.country}
            </Text>

            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="star" size={24} color="#f59e0b" />
                <Text className="text-lg font-semibold ml-1">
                  {winner.avgRating.toFixed(1)}
                </Text>
              </View>
              
              <View className="bg-green-100 rounded-full px-4 py-2">
                <Text className="text-green-800 font-semibold">
                  +{winner.netVotes} votes
                </Text>
              </View>
            </View>

            {winner.wineData && (
              <View className="border-t border-gray-200 pt-4">
                <View className="flex-row flex-wrap gap-2">
                  <View className="bg-purple-100 rounded-full px-3 py-1">
                    <Text className="text-purple-800 text-sm font-medium">
                      {winner.wineData.type}
                    </Text>
                  </View>
                  <View className="bg-purple-100 rounded-full px-3 py-1">
                    <Text className="text-purple-800 text-sm font-medium">
                      {winner.wineData.vintage}
                    </Text>
                  </View>
                  <View className="bg-purple-100 rounded-full px-3 py-1">
                    <Text className="text-purple-800 text-sm font-medium">
                      {winner.wineData.alcoholContent}% ABV
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="px-6 mt-6">
        <TouchableOpacity
          onPress={() => router.push('/map')}
          className="bg-purple-600 rounded-lg p-4 flex-row items-center justify-center mb-3"
        >
          <MaterialCommunityIcons name="map-marker" size={24} color="white" />
          <Text className="text-white font-semibold text-lg ml-2">
            Find Nearby Stores
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/product/${winner.productId}`)}
          className="bg-gray-200 rounded-lg p-4 flex-row items-center justify-center mb-3"
        >
          <MaterialCommunityIcons name="information" size={24} color="#4b5563" />
          <Text className="text-gray-700 font-semibold text-lg ml-2">
            View Details
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onReset}
          className="border border-gray-300 rounded-lg p-4 mb-6"
        >
          <Text className="text-gray-700 text-center font-semibold text-lg">
            Spin Again
          </Text>
        </TouchableOpacity>
      </View>

      {/* Rankings */}
      <View className="px-6 mb-8">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Final Rankings
        </Text>
        
        {sortedCandidates.map((wine, index) => (
          <View
            key={wine.productId}
            className={`flex-row items-center p-4 rounded-lg mb-2 ${
              wine.productId === session.winnerId
                ? 'bg-purple-100'
                : 'bg-white'
            }`}
          >
            <Text className="text-2xl font-bold text-gray-600 w-8">
              {index + 1}
            </Text>
            
            <Image
              source={{ uri: wine.images[0] || 'https://via.placeholder.com/50x50' }}
              className="w-12 h-12 rounded-lg mx-3"
              resizeMode="cover"
            />
            
            <View className="flex-1">
              <Text className="font-semibold text-gray-800" numberOfLines={1}>
                {wine.name}
              </Text>
              <Text className="text-gray-600 text-sm">{wine.brand}</Text>
            </View>
            
            <View className="items-end">
              <Text className="font-semibold text-gray-700">
                {wine.netVotes > 0 ? '+' : ''}{wine.netVotes}
              </Text>
              <Text className="text-xs text-gray-500">
                {wine.upvotes}👍 {wine.downvotes}👎
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}