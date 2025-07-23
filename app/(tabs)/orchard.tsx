import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';

export default function OrchardScreen() {
  const orchardData = useQuery((api as any).orchard.getUserOrchard, { limit: 100 });
  const communityData = useQuery((api as any).orchard.getCommunityTreeCount);

  if (!orchardData) {
    return (
      <View style={styles.centered}> 
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  const pending = orchardData.pendingTanks;
  const userTrees = orchardData.treesPlanted;
  const progress = (pending / 4) * 100;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {/* Header */}
      <Text style={styles.title}>My Virtual Orchard</Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Ionicons name="leaf" size={28} color="#2ecc71" />
          <Text style={styles.statNumber}>{userTrees}</Text>
          <Text style={styles.statLabel}>Trees Planted</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="timer" size={28} color="#f1c40f" />
          <Text style={styles.statNumber}>{pending}/4</Text>
          <Text style={styles.statLabel}>Tanks to Next Tree</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="earth" size={28} color="#3498db" />
          <Text style={styles.statNumber}>{communityData?.total ?? 0}</Text>
          <Text style={styles.statLabel}>Community Trees</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      {/* User Trees Grid */}
      <Text style={[styles.subtitle, { marginTop: 30 }]}>My Trees</Text>
      <View style={styles.grid}>
        {Array.from({ length: userTrees }).map((_, idx) => (
          <Ionicons
            key={idx}
            name="leaf"
            size={24}
            color="#2ecc71"
            style={{ margin: 4 }}
          />
        ))}
        {userTrees === 0 && <Text style={styles.noTrees}>No trees yet. Buy olive oil to start planting!</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 6,
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  progressContainer: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ecf0f1',
    overflow: 'hidden',
    marginTop: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2ecc71',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  noTrees: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});