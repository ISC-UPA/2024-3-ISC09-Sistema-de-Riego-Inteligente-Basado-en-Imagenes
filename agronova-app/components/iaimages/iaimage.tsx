import React, { useContext } from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import IAimageCard from '@/components/iaimages/ImageCard';
import { IconButton } from 'react-native-paper';
import { CropContext } from '../context/CropContext';

export default function IAimagesList() {
  const cropContext = useContext(CropContext);

  if (!cropContext) {
    throw new Error('CropContext debe estar dentro del proveedor CropProvider');
  }

  const { setImages } = cropContext;

  const handleBackPress = () => {
    setImages(false);
  };

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']}
      style={{ flex: 1 }}
    >
      <View style={styles.headerContainer}>
        <IconButton icon="chevron-left" size={24} onPress={handleBackPress} />
        <Text style={styles.titleText}>Historial de imágenes</Text>
      </View>
      <View style={styles.container}>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
