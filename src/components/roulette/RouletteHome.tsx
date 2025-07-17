import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const REGIONS = [
  'Santorini',
  'Naoussa',
  'Nemea',
  'Crete',
  'Macedonia',
  'Peloponnese',
  'Attica',
  'Rhodes',
];

export default function RouletteHome() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [sessionCode, setSessionCode] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Santorini');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [ratingMin, setRatingMin] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const createSession = useMutation(api.roulette.createSession);
  const joinSession = useMutation(api.roulette.joinSession);

  const handleCreateSession = async () => {
    try {
      setIsCreating(true);
      const filters = {
        priceMin: priceMin ? parseFloat(priceMin) : undefined,
        priceMax: priceMax ? parseFloat(priceMax) : undefined,
        ratingMin: ratingMin ? parseFloat(ratingMin) : undefined,
      };

      const result = await createSession({
        region: selectedRegion,
        filters,
      });

      setShowCreateModal(false);
      router.push(`/roulette/session/${result.sessionId}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to create session. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinSession = async () => {
    if (sessionCode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }

    try {
      setIsJoining(true);
      const result = await joinSession({ sessionCode });
      setShowJoinModal(false);
      router.push(`/roulette/session/${result.sessionId}`);
    } catch (error) {
      Alert.alert('Error', 'Invalid session code or session not found');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <View className="flex-1 justify-center">
        <View className="bg-white rounded-2xl p-8 shadow-lg">
          <View className="items-center mb-8">
            <MaterialCommunityIcons name="glass-wine" size={64} color="#7c3aed" />
            <Text className="text-3xl font-bold text-gray-800 mt-4">
              Wine Roulette
            </Text>
            <Text className="text-gray-600 mt-2 text-center">
              Spin, vote, and discover your group's perfect wine
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setShowCreateModal(true)}
            className="bg-purple-600 rounded-lg p-4 mb-4"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Create Party Roulette
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowJoinModal(true)}
            className="bg-gray-200 rounded-lg p-4"
          >
            <Text className="text-gray-800 text-center font-semibold text-lg">
              Join with Code
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Create Session Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            
            <Text className="text-2xl font-bold mb-4">Create Roulette</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Select Region</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {REGIONS.map((region) => (
                    <TouchableOpacity
                      key={region}
                      onPress={() => setSelectedRegion(region)}
                      className={`px-4 py-2 rounded-full mr-2 ${
                        selectedRegion === region
                          ? 'bg-purple-600'
                          : 'bg-gray-200'
                      }`}
                    >
                      <Text
                        className={
                          selectedRegion === region
                            ? 'text-white font-medium'
                            : 'text-gray-700'
                        }
                      >
                        {region}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">
                  Price Range (Optional)
                </Text>
                <View className="flex-row space-x-2">
                  <TextInput
                    value={priceMin}
                    onChangeText={setPriceMin}
                    placeholder="Min €"
                    keyboardType="numeric"
                    className="flex-1 bg-gray-100 rounded-lg px-4 py-3"
                  />
                  <TextInput
                    value={priceMax}
                    onChangeText={setPriceMax}
                    placeholder="Max €"
                    keyboardType="numeric"
                    className="flex-1 bg-gray-100 rounded-lg px-4 py-3"
                  />
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-gray-700 font-medium mb-2">
                  Minimum Rating (Optional)
                </Text>
                <TextInput
                  value={ratingMin}
                  onChangeText={setRatingMin}
                  placeholder="e.g., 4.0"
                  keyboardType="numeric"
                  className="bg-gray-100 rounded-lg px-4 py-3"
                />
              </View>

              <TouchableOpacity
                onPress={handleCreateSession}
                disabled={isCreating}
                className="bg-purple-600 rounded-lg p-4 mb-2"
              >
                {isCreating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold text-lg">
                    Create Session
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowCreateModal(false)}
                className="p-4"
              >
                <Text className="text-gray-600 text-center">Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Join Session Modal */}
      <Modal
        visible={showJoinModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowJoinModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center px-6">
          <View className="bg-white rounded-2xl p-6">
            <Text className="text-2xl font-bold mb-4">Join Session</Text>
            
            <Text className="text-gray-600 mb-4">
              Enter the 6-digit code shared by your host
            </Text>

            <TextInput
              value={sessionCode}
              onChangeText={setSessionCode}
              placeholder="123456"
              keyboardType="numeric"
              maxLength={6}
              className="bg-gray-100 rounded-lg px-4 py-4 text-center text-2xl mb-6"
            />

            <TouchableOpacity
              onPress={handleJoinSession}
              disabled={isJoining}
              className="bg-purple-600 rounded-lg p-4 mb-2"
            >
              {isJoining ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Join Session
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowJoinModal(false);
                setSessionCode('');
              }}
              className="p-4"
            >
              <Text className="text-gray-600 text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}