import React from 'react';
import { Stack } from "expo-router";
import { PaperProvider } from 'react-native-paper';
import { CropProvider } from '@/components/context/CropContext';

export default function RootLayout() {
  return (
    <PaperProvider>
      <CropProvider>
        <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      </CropProvider>
    </PaperProvider>
  );
}
