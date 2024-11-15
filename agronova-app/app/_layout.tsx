import React from 'react';
import { Stack } from "expo-router";
import { PaperProvider } from 'react-native-paper';
import { CropProvider } from '@/components/context/CropContext';
import { ApolloProvider } from '@apollo/client';
import client from '@/api/apolloClient';

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <PaperProvider>
        <CropProvider>
          <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        </CropProvider>
      </PaperProvider>
    </ApolloProvider>
  );
}
