import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import RouletteHome from '../../src/components/roulette/RouletteHome';

export default function RouletteIndexScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Wine Roulette',
          headerBackTitle: 'Back',
        }}
      />
      <RouletteHome />
    </>
  );
}