import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import SessionLobby from '../../../src/components/roulette/SessionLobby';
import VotingScreen from '../../../src/components/roulette/VotingScreen';
import ResultScreen from '../../../src/components/roulette/ResultScreen';

export default function SessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const sessionId = id as Id<"sessions">;
  
  // Get session data with real-time updates
  const session = useQuery(api.roulette.getSession, { sessionId });

  if (!session) {
    return (
      <>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <View className="flex-1 bg-gray-50 items-center justify-center">
          <ActivityIndicator size="large" color="#7c3aed" />
        </View>
      </>
    );
  }

  const handleReset = () => {
    router.replace('/roulette');
  };

  const renderContent = () => {
    switch (session.status) {
      case 'pending':
        return (
          <SessionLobby
            session={session}
            sessionId={sessionId}
            onSpinComplete={() => {
              // The session status will automatically update via Convex subscription
            }}
          />
        );
        
      case 'voting':
        return (
          <VotingScreen
            session={session}
            sessionId={sessionId}
            onComplete={() => {
              // The session status will automatically update via Convex subscription
            }}
          />
        );
        
      case 'complete':
        return (
          <ResultScreen
            session={session}
            sessionId={sessionId}
            onReset={handleReset}
          />
        );
        
      default:
        return (
          <View className="flex-1 bg-gray-50 items-center justify-center">
            <Text className="text-gray-600">Unknown session status</Text>
          </View>
        );
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: session.status === 'pending' ? 'Waiting Room' : 
                 session.status === 'voting' ? 'Vote Now' : 
                 'Results',
          headerBackTitle: 'Exit',
        }}
      />
      {renderContent()}
    </>
  );
}