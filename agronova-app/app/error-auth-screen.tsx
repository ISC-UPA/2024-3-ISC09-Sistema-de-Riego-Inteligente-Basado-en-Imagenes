import React from 'react';
import { Text, SafeAreaView, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';

export default function ErrorScreen() {
  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']}
      style={{ flex: 1 }}
    >
      <Stack.Screen options={{ title: '', headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <Image 
          source={require('@/assets/images/logo.png')} 
          style={styles.logo} 
        />
        <Image 
          source={require('@/assets/images/agronova.png')} 
          style={styles.agronova} 
        />
        <Text style={styles.errorText}>
          Hubo un error al iniciar sesión, por favor contacte a soporte técnico.
        </Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  agronova: {
    width: 320,
    height: 100,
    marginBottom: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
    color: '#0369a1',
    fontWeight: 'bold',
  },
});
