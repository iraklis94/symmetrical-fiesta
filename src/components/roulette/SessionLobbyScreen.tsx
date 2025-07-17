import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface Props {
  session: any; // Type from Convex query
  onSpinStart: () => void;
}

export default function SessionLobbyScreen({ session, onSpinStart }: Props) {
  const spinSession = useMutation(api.roulette.spinSession);
  const isHost = session.hostUserId === 'demo-user'; // Replace with actual auth

  const handleShareCode = async () => {
    try {
      await Share.share({
        message: `Join my Wine Roulette session! Code: ${session.sessionCode}`,
        title: 'Wine Roulette Invitation',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleStartSpin = async () => {
    try {
      await spinSession({ sessionId: session._id });
      onSpinStart();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start spin');
      console.error(error);
    }
  };

  const copyCodeToClipboard = () => {
    // In a real app, you'd use Clipboard API
    Alert.alert('Copied!', `Session code ${session.sessionCode} copied to clipboard`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Wine Roulette Lobby</Text>
        <Text style={styles.subtitle}>
          {session.participantIds.length} {session.participantIds.length === 1 ? 'participant' : 'participants'} • {session.region}
        </Text>
      </View>

      <View style={styles.codeSection}>
        <Text style={styles.codeLabel}>Session Code</Text>
        <TouchableOpacity style={styles.codeContainer} onPress={copyCodeToClipboard}>
          <Text style={styles.code}>{session.sessionCode}</Text>
          <Ionicons name="copy-outline" size={20} color="#7f8c8d" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={handleShareCode}>
          <Ionicons name="share-outline" size={20} color="#e74c3c" />
          <Text style={styles.shareButtonText}>Share Invite</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Session Details</Text>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={20} color="#7f8c8d" />
          <Text style={styles.detailText}>Region: {session.region}</Text>
        </View>
        {session.filters.priceMin || session.filters.priceMax ? (
          <View style={styles.detailItem}>
            <Ionicons name="pricetag-outline" size={20} color="#7f8c8d" />
            <Text style={styles.detailText}>
              Price: €{session.filters.priceMin || '0'} - €{session.filters.priceMax || '∞'}
            </Text>
          </View>
        ) : null}
        {session.filters.ratingMin ? (
          <View style={styles.detailItem}>
            <Ionicons name="star-outline" size={20} color="#7f8c8d" />
            <Text style={styles.detailText}>
              Min Rating: {session.filters.ratingMin}+ ⭐
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.participantsSection}>
        <Text style={styles.sectionTitle}>Participants</Text>
        <View style={styles.participantsList}>
          {session.participantIds.map((participantId: string, index: number) => (
            <View key={participantId} style={styles.participant}>
              <View style={styles.participantAvatar}>
                <Text style={styles.participantInitial}>
                  {index === 0 ? '👑' : '🍷'}
                </Text>
              </View>
              <Text style={styles.participantName}>
                {index === 0 ? 'Host' : `Guest ${index}`}
              </Text>
              {participantId === 'demo-user' && (
                <Text style={styles.youTag}>(You)</Text>
              )}
            </View>
          ))}
        </View>
      </View>

      {isHost ? (
        <View style={styles.hostActions}>
          <Text style={styles.waitingText}>
            Waiting for more friends or ready to spin?
          </Text>
          <TouchableOpacity
            style={styles.spinButton}
            onPress={handleStartSpin}
          >
            <Ionicons name="dice-outline" size={24} color="white" />
            <Text style={styles.spinButtonText}>Start Wine Spin!</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.guestWaiting}>
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={styles.waitingText}>
            Waiting for host to start the spin...
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  codeSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  code: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    letterSpacing: 5,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  shareButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '500',
  },
  detailsSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  participantsSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  participantsList: {
    gap: 12,
  },
  participant: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantInitial: {
    fontSize: 20,
  },
  participantName: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
  },
  youTag: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  hostActions: {
    alignItems: 'center',
  },
  waitingText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  spinButton: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 10,
    width: '100%',
  },
  spinButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  guestWaiting: {
    alignItems: 'center',
    paddingVertical: 40,
  },
});