import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

interface Props {
  onSessionJoined: (sessionId: Id<"sessions">) => void;
  onBack: () => void;
}

export default function JoinSessionScreen({ onSessionJoined, onBack }: Props) {
  const [sessionCode, setSessionCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const joinSession = useMutation(api.roulette.joinSession);

  const handleJoinSession = async () => {
    if (sessionCode.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter a 6-digit session code');
      return;
    }

    setIsJoining(true);
    try {
      const result = await joinSession({ sessionCode });
      
      if (result.alreadyJoined) {
        Alert.alert('Welcome Back', 'You\'re already in this session!');
      }
      
      onSessionJoined(result.sessionId);
    } catch (error: any) {
      if (error.message.includes('not found')) {
        Alert.alert('Session Not Found', 'Please check the code and try again');
      } else if (error.message.includes('already started')) {
        Alert.alert('Session Started', 'This session has already begun');
      } else {
        Alert.alert('Error', 'Failed to join session. Please try again.');
      }
      console.error(error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleCodeChange = (text: string) => {
    // Only allow numbers and limit to 6 digits
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
    setSessionCode(cleaned);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.icon}>🎉</Text>
          <Text style={styles.title}>Join Wine Roulette</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code shared by your host
          </Text>
        </View>

        <View style={styles.codeContainer}>
          <TextInput
            ref={inputRef}
            style={styles.codeInput}
            value={sessionCode}
            onChangeText={handleCodeChange}
            placeholder="000000"
            placeholderTextColor="#bdc3c7"
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
            textAlign="center"
          />
          <Text style={styles.codeHint}>
            {sessionCode.length}/6 digits
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.joinButton,
            (isJoining || sessionCode.length !== 6) && styles.joinButtonDisabled,
          ]}
          onPress={handleJoinSession}
          disabled={isJoining || sessionCode.length !== 6}
        >
          {isJoining ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="enter-outline" size={24} color="white" />
              <Text style={styles.joinButtonText}>Join Session</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.info}>
          <View style={styles.infoItem}>
            <Ionicons name="information-circle-outline" size={20} color="#7f8c8d" />
            <Text style={styles.infoText}>
              Ask your host for the session code
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="people-outline" size={20} color="#7f8c8d" />
            <Text style={styles.infoText}>
              Multiple friends can join the same session
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  codeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  codeInput: {
    backgroundColor: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2c3e50',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e74c3c',
    width: '100%',
    maxWidth: 300,
    letterSpacing: 10,
  },
  codeHint: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 10,
  },
  joinButton: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 10,
    marginBottom: 40,
  },
  joinButtonDisabled: {
    opacity: 0.6,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  info: {
    gap: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
    flex: 1,
  },
});