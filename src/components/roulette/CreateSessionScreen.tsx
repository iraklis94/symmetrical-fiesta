import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

const GREEK_WINE_REGIONS = [
  { id: 'santorini', name: 'Santorini', description: 'Volcanic wines with minerality' },
  { id: 'naoussa', name: 'Naoussa', description: 'Premium red wines' },
  { id: 'nemea', name: 'Nemea', description: 'Agiorgitiko varietals' },
  { id: 'crete', name: 'Crete', description: 'Diverse indigenous varieties' },
  { id: 'peloponnese', name: 'Peloponnese', description: 'Wide range of styles' },
  { id: 'macedonia', name: 'Macedonia', description: 'Northern Greek wines' },
];

interface Props {
  onSessionCreated: (sessionId: Id<"sessions">) => void;
  onBack: () => void;
  showJoinOption?: () => void;
}

export default function CreateSessionScreen({ onSessionCreated, onBack, showJoinOption }: Props) {
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [ratingMin, setRatingMin] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const createSession = useMutation(api.roulette.createSession);

  const handleCreateSession = async () => {
    if (!selectedRegion) {
      Alert.alert('Select Region', 'Please select a wine region to continue');
      return;
    }

    setIsCreating(true);
    try {
      const result = await createSession({
        region: selectedRegion,
        filters: {
          priceMin: priceMin ? parseFloat(priceMin) : undefined,
          priceMax: priceMax ? parseFloat(priceMax) : undefined,
          ratingMin: ratingMin ? parseFloat(ratingMin) : undefined,
        },
      });

      onSessionCreated(result.sessionId);
    } catch (error) {
      Alert.alert('Error', 'Failed to create session. Please try again.');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>🍷 Create Wine Roulette</Text>
        <Text style={styles.subtitle}>
          Select a region and spin to discover amazing Greek wines with your friends!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Wine Region</Text>
        <View style={styles.regionGrid}>
          {GREEK_WINE_REGIONS.map((region) => (
            <TouchableOpacity
              key={region.id}
              style={[
                styles.regionCard,
                selectedRegion === region.id && styles.regionCardSelected,
              ]}
              onPress={() => setSelectedRegion(region.id)}
            >
              <Text style={[
                styles.regionName,
                selectedRegion === region.id && styles.regionNameSelected,
              ]}>
                {region.name}
              </Text>
              <Text style={[
                styles.regionDescription,
                selectedRegion === region.id && styles.regionDescriptionSelected,
              ]}>
                {region.description}
              </Text>
              {selectedRegion === region.id && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={24} color="#e74c3c" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Optional Filters</Text>
        
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Price Range (€)</Text>
          <View style={styles.priceInputs}>
            <TextInput
              style={styles.priceInput}
              placeholder="Min"
              value={priceMin}
              onChangeText={setPriceMin}
              keyboardType="numeric"
              placeholderTextColor="#95a5a6"
            />
            <Text style={styles.priceSeparator}>-</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="Max"
              value={priceMax}
              onChangeText={setPriceMax}
              keyboardType="numeric"
              placeholderTextColor="#95a5a6"
            />
          </View>
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Minimum Rating</Text>
          <View style={styles.ratingOptions}>
            {[3, 3.5, 4, 4.5].map((rating) => (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.ratingOption,
                  ratingMin === rating.toString() && styles.ratingOptionSelected,
                ]}
                onPress={() => setRatingMin(rating.toString())}
              >
                <Text style={[
                  styles.ratingOptionText,
                  ratingMin === rating.toString() && styles.ratingOptionTextSelected,
                ]}>
                  {rating}+ ⭐
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.createButton, isCreating && styles.createButtonDisabled]}
          onPress={handleCreateSession}
          disabled={isCreating || !selectedRegion}
        >
          {isCreating ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="dice-outline" size={24} color="white" />
              <Text style={styles.createButtonText}>Create Session</Text>
            </>
          )}
        </TouchableOpacity>

        {showJoinOption && (
          <TouchableOpacity style={styles.joinButton} onPress={showJoinOption}>
            <Text style={styles.joinButtonText}>Join Existing Session</Text>
          </TouchableOpacity>
        )}
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
  header: {
    marginBottom: 30,
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
    lineHeight: 22,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  regionGrid: {
    gap: 12,
  },
  regionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ecf0f1',
    marginBottom: 12,
    position: 'relative',
  },
  regionCardSelected: {
    borderColor: '#e74c3c',
    backgroundColor: '#fee',
  },
  regionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  regionNameSelected: {
    color: '#e74c3c',
  },
  regionDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  regionDescriptionSelected: {
    color: '#c0392b',
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  filterRow: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 10,
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  priceSeparator: {
    marginHorizontal: 10,
    color: '#7f8c8d',
  },
  ratingOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  ratingOption: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  ratingOptionSelected: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  ratingOptionText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  ratingOptionTextSelected: {
    color: 'white',
  },
  actions: {
    marginTop: 20,
  },
  createButton: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  joinButton: {
    marginTop: 12,
    padding: 16,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '500',
  },
});