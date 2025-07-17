import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import CreateSessionScreen from '../../src/components/roulette/CreateSessionScreen';
import JoinSessionScreen from '../../src/components/roulette/JoinSessionScreen';
import SessionLobbyScreen from '../../src/components/roulette/SessionLobbyScreen';
import SpinScreen from '../../src/components/roulette/SpinScreen';
import VotingScreen from '../../src/components/roulette/VotingScreen';
import ResultScreen from '../../src/components/roulette/ResultScreen';

export default function RouletteScreen() {
  const params = useLocalSearchParams();
  const [sessionId, setSessionId] = useState<Id<"sessions"> | null>(null);
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');

  // Get session data with real-time updates
  const sessionData = useQuery(
    api.roulette.getSession,
    sessionId ? { sessionId } : "skip"
  );

  useEffect(() => {
    // Handle deep linking from params
    if (params.sessionId) {
      setSessionId(params.sessionId as Id<"sessions">);
    }
  }, [params.sessionId]);

  // Determine which screen to show based on session state
  const renderContent = () => {
    if (!sessionId) {
      switch (mode) {
        case 'create':
          return (
            <CreateSessionScreen
              onSessionCreated={(id) => setSessionId(id)}
              onBack={() => setMode('choose')}
            />
          );
        case 'join':
          return (
            <JoinSessionScreen
              onSessionJoined={(id) => setSessionId(id)}
              onBack={() => setMode('choose')}
            />
          );
        default:
          return (
            <View style={styles.chooseContainer}>
              <CreateSessionScreen
                onSessionCreated={(id) => setSessionId(id)}
                onBack={() => {}}
                showJoinOption={() => setMode('join')}
              />
            </View>
          );
      }
    }

    if (!sessionData) {
      return <View style={styles.loadingContainer} />;
    }

    switch (sessionData.status) {
      case 'pending':
        return (
          <SessionLobbyScreen
            session={sessionData}
            onSpinStart={() => {}}
          />
        );
      case 'voting':
        if (sessionData.candidates.length === 0) {
          return <SpinScreen session={sessionData} />;
        }
        return <VotingScreen session={sessionData} />;
      case 'complete':
        return (
          <ResultScreen
            session={sessionData}
            onNewSession={() => {
              setSessionId(null);
              setMode('choose');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Wine Roulette',
          headerShown: true,
        }}
      />
      <View style={styles.container}>{renderContent()}</View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  chooseContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});