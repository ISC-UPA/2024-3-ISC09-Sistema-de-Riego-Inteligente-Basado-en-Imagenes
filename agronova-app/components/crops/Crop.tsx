import React, { useState, useContext } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Switch, Card, IconButton } from 'react-native-paper';
import { ThemedView } from '@/components/widgets/ThemedView';
import { CropContext } from '@/components/context/CropContext';
import RecordsInfoCard from '../widgets/RecordsInfoCard';
import ParallaxScrollView from '../widgets/ParallaxScrollView';
import { useQuery } from '@apollo/client';
import { GET_CROP_INFO } from '@/api/queries/queryUsers'; // Asegúrate de que la ruta sea correcta

export default function CropScreen() {
  const cropContext = useContext(CropContext);

  // Verifica que cropContext no sea undefined
  if (!cropContext) {
    throw new Error('CropContext debe estar dentro del proveedor CropProvider');
  }

  const { selectedCropId, clearCropId, setStatistics } = cropContext;
  const [isAutomatic, setIsAutomatic] = useState(false);
  const toggleSwitch = () => setIsAutomatic(!isAutomatic);

  // Realizar la petición para obtener los datos del cultivo
  const { loading, error, data } = useQuery(GET_CROP_INFO, {
    variables: { where: { id: selectedCropId } }, // Utilizar el `selectedCropId` como variable
    skip: !selectedCropId, // Evitar el query si no hay un `id` seleccionado
  });

  // Manejo de carga y errores
  if (loading) {
    return <ActivityIndicator size="large" color="#0284c7" />;
  }
  
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  // Si los datos están disponibles
  const crop = data?.crop;

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd','#7dd3fc']} 
      style={{ flex: 1 }}
    >
      <View style={styles.headerContainer}>
        <IconButton
          icon="chevron-left"
          size={24}
          onPress={clearCropId}
        />
        <Text style={styles.titleText}>{crop?.crop_name || 'Cultivo'}</Text>
      </View>
      <ThemedView 
        style={{ flex: 1 }}
        lightColor="transparent"
        darkColor="transparent">
        <ParallaxScrollView>
          <View>
            <RecordsInfoCard></RecordsInfoCard>
          </View>
          <View>
            <View style={styles.descriptionContainer}>
              <View style={styles.locationContainer}>
                <IconButton icon="map-marker" size={20} />
                <Text style={styles.locationText}>{crop?.location || 'Sin ubicación'}</Text>
              </View>
              <View style={styles.switchContainer}>
                <Text style={styles.text}>Automático</Text>
                <Switch
                  value={isAutomatic}
                  onValueChange={toggleSwitch}
                  color="#65a30d"
                  thumbColor="#d1d5db"
                />
              </View>
            </View>
          </View>
          <View>
            <Card style={styles.imageContainer}>
              <Image 
                source={{ uri: 'https://via.placeholder.com/150' }} // Puedes cambiar a una imagen real si tienes el enlace
                style={styles.image}
              />
            </Card>
          </View>
          <View>
            <View style={styles.stadisticsContainer}>
              <Button 
                icon="coolant-temperature" 
                mode="contained"
                buttonColor="#e0f2fe"
                labelStyle={{ color: "#0ea5e9" }}
                style={{ margin: 0 }}
                onPress={() => {}}>
                37°
              </Button>
              <Button 
                icon="air-humidifier" 
                mode="contained"
                buttonColor="#e0f2fe"
                labelStyle={{ color: "#0ea5e9" }}
                style={{ margin: 0 }}
                onPress={() => {}}>
                65%
              </Button>
              <Button 
                icon="water-pump" 
                mode="contained"
                buttonColor="#e0f2fe"
                labelStyle={{ color: "#0ea5e9" }}
                style={{ margin: 0 }}
                onPress={() => {}}>
                80%
              </Button>
            </View>
          </View>
          <View>
            <Button 
              icon="chart-line" 
              buttonColor={'#bae6fd'} 
              labelStyle={{ color: "#0284c7", }}
              onPress={() => setStatistics(true)}  >
              Estadísticas
            </Button>
          </View>
        </ParallaxScrollView> 
      </ThemedView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,   
    alignItems: 'center',  
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',  
    alignItems: 'center',  
  },
  imageContainer: {
    height: 250,
    marginVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stadisticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    width: '100%',  
  },
  locationText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 4, // Espacio entre el ícono y el texto
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0c4a6e',
  },
  text: {
    color: '#374151',  
    fontWeight: '600', 
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});