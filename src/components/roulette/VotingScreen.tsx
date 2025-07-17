import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface Props {
  session: any;
}

export default function VotingScreen({ session }: Props) {
  const [votedProducts, setVotedProducts] = useState<Set<string>>(new Set());
  const [animatedValues] = useState(() =>
    session.candidates.map(() => new Animated.Value(0))
  );

  const castVote = useMutation(api.roulette.castVote);
  const userVotes = useQuery(api.roulette.getUserVotes, { sessionId: session._id });

  useEffect(() => {
    // Animate cards in sequence
    session.candidates.forEach((_, index) => {
      Animated.spring(animatedValues[index], {
        toValue: 1,
        tension: 20,
        friction: 7,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handleVote = async (productId: string, upvote: boolean) => {
    try {
      await castVote({
        sessionId: session._id,
        productId,
        upvote,
      });
      setVotedProducts(prev => new Set([...prev, productId]));
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };

  const allVoted = session.candidates.every((candidate: any) =>
    votedProducts.has(candidate.product._id) || userVotes?.[candidate.product._id] !== undefined
  );

  const totalVotes = session.candidates.reduce((sum: number, candidate: any) => {
    return sum + candidate.votes.upvotes + candidate.votes.downvotes;
  }, 0);

  const expectedVotes = session.participantIds.length * session.candidates.length;
  const votingProgress = totalVotes / expectedVotes;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Vote for Your Favorites!</Text>
        <Text style={styles.subtitle}>
          {session.participantIds.length} people voting • {session.region} wines
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${votingProgress * 100}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round(votingProgress * 100)}% votes cast
        </Text>
      </View>

      <View style={styles.wineGrid}>
        {session.candidates.map((candidate: any, index: number) => {
          const hasVoted = votedProducts.has(candidate.product._id) || 
                          userVotes?.[candidate.product._id] !== undefined;
          const userVote = userVotes?.[candidate.product._id];
          
          return (
            <Animated.View
              key={candidate.product._id}
              style={[
                styles.wineCard,
                {
                  opacity: animatedValues[index],
                  transform: [
                    {
                      translateY: animatedValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.wineImageContainer}>
                {candidate.product.images?.[0] ? (
                  <Image
                    source={{ uri: candidate.product.images[0] }}
                    style={styles.wineImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={styles.wineImagePlaceholder}>🍷</Text>
                )}
              </View>

              <View style={styles.wineInfo}>
                <Text style={styles.wineName} numberOfLines={2}>
                  {candidate.product.name}
                </Text>
                <Text style={styles.wineBrand} numberOfLines={1}>
                  {candidate.product.brand}
                </Text>
                
                <View style={styles.wineStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="star" size={16} color="#f39c12" />
                    <Text style={styles.statText}>
                      {candidate.product.avgRating.toFixed(1)}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statText}>
                      €{candidate.product.price || 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.voteSection}>
                <View style={styles.voteButtons}>
                  <TouchableOpacity
                    style={[
                      styles.voteButton,
                      styles.downvoteButton,
                      hasVoted && userVote === false && styles.voteButtonActive,
                      hasVoted && userVote !== false && styles.voteButtonInactive,
                    ]}
                    onPress={() => handleVote(candidate.product._id, false)}
                    disabled={hasVoted}
                  >
                    <Ionicons 
                      name="thumbs-down" 
                      size={24} 
                      color={hasVoted && userVote === false ? 'white' : '#e74c3c'} 
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.voteButton,
                      styles.upvoteButton,
                      hasVoted && userVote === true && styles.voteButtonActive,
                      hasVoted && userVote !== true && styles.voteButtonInactive,
                    ]}
                    onPress={() => handleVote(candidate.product._id, true)}
                    disabled={hasVoted}
                  >
                    <Ionicons 
                      name="thumbs-up" 
                      size={24} 
                      color={hasVoted && userVote === true ? 'white' : '#27ae60'} 
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.voteCounts}>
                  <Text style={styles.voteCount}>
                    {candidate.votes.downvotes} 👎
                  </Text>
                  <Text style={styles.voteCount}>
                    {candidate.votes.upvotes} 👍
                  </Text>
                </View>
              </View>
            </Animated.View>
          );
        })}
      </View>

      {allVoted && (
        <View style={styles.waitingSection}>
          <Ionicons name="time-outline" size={40} color="#7f8c8d" />
          <Text style={styles.waitingText}>
            Waiting for other participants to finish voting...
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
    marginBottom: 20,
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
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e74c3c',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  wineGrid: {
    gap: 20,
  },
  wineCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  wineImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  wineImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  wineImagePlaceholder: {
    fontSize: 60,
  },
  wineInfo: {
    marginBottom: 16,
  },
  wineName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  wineBrand: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  wineStats: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  voteSection: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 16,
  },
  voteButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 12,
  },
  voteButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  downvoteButton: {
    borderColor: '#e74c3c',
  },
  upvoteButton: {
    borderColor: '#27ae60',
  },
  voteButtonActive: {
    backgroundColor: '#2c3e50',
    borderColor: '#2c3e50',
  },
  voteButtonInactive: {
    opacity: 0.3,
  },
  voteCounts: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 60,
  },
  voteCount: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  waitingSection: {
    alignItems: 'center',
    paddingVertical: 40,
    marginTop: 20,
  },
  waitingText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 16,
    textAlign: 'center',
  },
});