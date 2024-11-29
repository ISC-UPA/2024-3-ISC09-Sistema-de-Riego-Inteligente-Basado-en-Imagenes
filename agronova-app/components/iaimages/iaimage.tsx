import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import IAimageCard from '@/components/iaimages/ImageCard'; // Asegúrate de que este componente acepte props
import { IconButton } from 'react-native-paper';
import { CropContext } from '../context/CropContext';
import { useQuery } from '@apollo/client'; // Si necesitas usar una consulta para cargar las imágenes
import { GET_CROP_IMAGES } from '@/api/queries/queryUsers';

export default function IAimagesList() {
  const cropContext = useContext(CropContext);

  if (!cropContext) {
    throw new Error('CropContext debe estar dentro del proveedor CropProvider');
  }

  const { setImages, selectedCropId } = cropContext; // Asegúrate de tener selectedCropId

  const [images, setImagesState] = useState([]);

  // Query para obtener las imágenes del cultivo
  const { data, loading, error } = useQuery(GET_CROP_IMAGES, {
    variables: { where: { crop_id: { id: { equals: selectedCropId } } },
      orderBy:[{id:"desc"}]},
  });

  useEffect(() => {
    if (data) {
      setImagesState(data.cropMedias); // Guarda las imágenes obtenidas en el estado
    }
  }, [data]);

  const handleBackPress = () => {
    setImages(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0c4a6e" />;
  }

  if (error) {
    return <Text>Error al cargar las imágenes</Text>;
  }

  console.log(images)

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
          {/* Renderiza las imágenes dinámicamente */}
          {images.length > 0 ? (
            images.map((image) => (
              <IAimageCard
                key={image.id}
                imageUrl={image.address} // Asegúrate de que IAimageCard acepte esta prop
                mediaType={image.media_type}
                description={image.state_description}
                date={image.date}
              />
            ))
          ) : (
            <Text>No hay imágenes disponibles</Text>
          )}
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
    marginBottom: 8,
  },
  scrollView: {
    marginVertical: 25,
  },
});
