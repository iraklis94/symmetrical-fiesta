import React from 'react';
import { Stack } from 'expo-router';
import WineStorytelling from '../../src/components/storytelling/WineStorytelling';

export default function StorytellingIndex() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Wine Story',
          headerBackTitle: 'Back',
        }}
      />
      <WineStorytelling />
    </>
  );
}