import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import IAimageCard from '@/components/iaimages/ImageCard';

export default function IAimagesList() {
  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']}
      style={{ flex: 1 }}
    >
      <Stack.Screen options={{ title: '', headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.titleText}>Rancho "Nombre del Rancho"</Text>
        <Text style={styles.subtitleText}>Historial de imágenes</Text> {/* Subtítulo agregado */}
        <ScrollView style={styles.scrollView}>
          {/* Aquí llamamos al componente IAimageCard */}
          <IAimageCard />
          <IAimageCard />
          <IAimageCard />
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0c4a6e',
    marginBottom: 8, // Reducido el margen para dar espacio al subtítulo
  },
  subtitleText: {
    fontSize: 18, // Tamaño del subtítulo más pequeño que el título
    fontWeight: 'normal', // Sin negrita
    color: '#0c4a6e', // Mismo color que el título
    marginBottom: 16, // Margen inferior para separar del contenido
  },
  scrollView: {
    marginVertical: 25,
  },
});
