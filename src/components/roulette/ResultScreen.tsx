import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface Props {
  session: any;
  onNewSession: () => void;
}

export default function ResultScreen({ session, onNewSession }: Props) {
  const scaleAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  // Get winner details
  const winner = session.candidates.find(
    (c: any) => c.product._id === session.winnerId
  );

  useEffect(() => {
    // Trigger confetti
    // if (confettiRef.current) {
    //   confettiRef.current.startConfetti();
    // }

    // Animate winner card
    Animated.sequence([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimation, {
        toValue: 1,
        tension: 20,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Stop confetti after 3 seconds
    const timer = setTimeout(() => {
      // if (confettiRef.current) {
      //   confettiRef.current.stopConfetti();
      // }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleFindNearby = () => {
    // Navigate to map with wine filter
    router.push({
      pathname: '/map',
      params: {
        productId: winner.product._id,
        productName: winner.product.name,
      },
    });
  };

  const handleAddToCart = () => {
    // Add to cart logic
    console.log('Add to cart:', winner.product._id);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `We picked ${winner.product.name} for our wine night! 🍷 Found using Wine Roulette.`,
        title: 'Our Wine Pick',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!winner) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No winner found</Text>
      </View>
    );
  }

  // Calculate vote percentage
  const totalUpvotes = session.candidates.reduce(
    (sum: number, c: any) => sum + c.votes.upvotes,
    0
  );
  const winnerPercentage = totalUpvotes > 0
    ? Math.round((winner.votes.upvotes / totalUpvotes) * 100)
    : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Confetti component would be added here in a real app */}
      
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnimation,
          },
        ]}
      >
        <Text style={styles.title}>🎉 We Have a Winner! 🎉</Text>
        <Text style={styles.subtitle}>
          {winnerPercentage}% of votes • {session.participantIds.length} participants
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.winnerCard,
          {
            opacity: fadeAnimation,
            transform: [{ scale: scaleAnimation }],
          },
        ]}
      >
        <View style={styles.winnerBadge}>
          <Text style={styles.winnerBadgeText}>WINNER</Text>
        </View>

        <View style={styles.wineImageContainer}>
          {winner.product.images?.[0] ? (
            <Image
              source={{ uri: winner.product.images[0] }}
              style={styles.wineImage}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.wineImagePlaceholder}>🍷</Text>
          )}
        </View>

        <View style={styles.wineDetails}>
          <Text style={styles.wineName}>{winner.product.name}</Text>
          <Text style={styles.wineBrand}>{winner.product.brand}</Text>
          
          <View style={styles.wineStats}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={20} color="#f39c12" />
              <Text style={styles.statText}>
                {winner.product.avgRating.toFixed(1)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="location" size={20} color="#e74c3c" />
              <Text style={styles.statText}>{session.region}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.priceText}>
                €{winner.product.price || 'N/A'}
              </Text>
            </View>
          </View>

          {winner.product.description && (
            <Text style={styles.description} numberOfLines={3}>
              {winner.product.description}
            </Text>
          )}
        </View>

        <View style={styles.voteResults}>
          <View style={styles.voteBar}>
            <View
              style={[
                styles.voteBarFill,
                { width: `${winnerPercentage}%` },
              ]}
            />
          </View>
          <Text style={styles.voteResultText}>
            {winner.votes.upvotes} 👍 vs {winner.votes.downvotes} 👎
          </Text>
        </View>
      </Animated.View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleFindNearby}>
          <Ionicons name="map-outline" size={24} color="white" />
          <Text style={styles.primaryButtonText}>Find Nearby Stores</Text>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleAddToCart}>
            <Ionicons name="cart-outline" size={20} color="#e74c3c" />
            <Text style={styles.secondaryButtonText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color="#e74c3c" />
            <Text style={styles.secondaryButtonText}>Share Pick</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.newSessionButton} onPress={onNewSession}>
          <Ionicons name="dice-outline" size={20} color="#2c3e50" />
          <Text style={styles.newSessionButtonText}>Spin Again</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.otherPicks}>
        <Text style={styles.otherPicksTitle}>Other Candidates</Text>
        {session.candidates
          .filter((c: any) => c.product._id !== session.winnerId)
          .map((candidate: any) => (
            <View key={candidate.product._id} style={styles.otherPickItem}>
              <Text style={styles.otherPickName} numberOfLines={1}>
                {candidate.product.name}
              </Text>
              <Text style={styles.otherPickVotes}>
                {candidate.votes.upvotes} 👍
              </Text>
            </View>
          ))}
      </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  winnerCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  winnerBadge: {
    position: 'absolute',
    top: -15,
    right: 20,
    backgroundColor: '#f39c12',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 10,
  },
  winnerBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  wineImageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  wineImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  wineImagePlaceholder: {
    fontSize: 80,
  },
  wineDetails: {
    marginBottom: 20,
  },
  wineName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  wineBrand: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  wineStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  description: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  voteResults: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 16,
  },
  voteBar: {
    height: 12,
    backgroundColor: '#ecf0f1',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  voteBarFill: {
    height: '100%',
    backgroundColor: '#27ae60',
    borderRadius: 6,
  },
  voteResultText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  actions: {
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 10,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e74c3c',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '500',
  },
  newSessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 8,
  },
  newSessionButtonText: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: '500',
  },
  otherPicks: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  otherPicksTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  otherPickItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  otherPickName: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
  },
  otherPickVotes: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});