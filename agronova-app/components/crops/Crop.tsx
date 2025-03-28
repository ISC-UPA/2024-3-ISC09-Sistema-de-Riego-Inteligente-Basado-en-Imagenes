import React, { useState, useContext, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Button, Switch, Card, IconButton } from 'react-native-paper';
import { ThemedView } from '@/components/widgets/ThemedView';
import { CropContext } from '@/components/context/CropContext';
import { CropChart } from './CropChart';
import { useQuery } from '@apollo/client';
import { GET_STATISTICS } from '@/api/queries/queryStatistics';
import RecordsInfoCard from '../widgets/RecordsInfoCard';
import ParallaxScrollView from '../widgets/ParallaxScrollView';
import { GET_CROP_INFO } from '@/api/queries/queryUsers'; // Asegúrate de que la ruta sea correcta
import { GET_CROP_RECENT_IMAGE } from '@/api/queries/queryUsers';

export default function CropScreen() {
  const cropContext = useContext(CropContext);

  // Verifica que cropContext no sea undefined
  if (!cropContext) {
    throw new Error('CropContext debe estar dentro del proveedor CropProvider');
  }

  const { selectedCropId, clearCropId, setStatistics, setImages } = cropContext;
  const [isAutomatic, setIsAutomatic] = useState(false);
  const toggleSwitch = () => setIsAutomatic(!isAutomatic);

  const [selectedParameter, setSelectedParameter] = useState('air_temperature'); // Parámetro por defecto

  const cropId = cropContext.selectedCropId;

  const { data, refetch } = useQuery(GET_STATISTICS, {
    variables: {
      where: {
        crop_id: { id: { equals: cropId } },
      },
      take: 10,
      orderBy: { timestamp: 'desc' },
    },
  });

  // Query para obtener la imagen más reciente
  const { loading: loadingImage, error: errorImage, data: imageData, refetch: refetchImage } = useQuery(GET_CROP_RECENT_IMAGE, {
    variables: {
      where: { crop_id: { id: { equals: cropId } } }, // ID del cultivo seleccionado
      take: 1,
      orderBy: [
        {
          id :"desc"
        }
      ]
    },
    skip: !selectedCropId, // Evita ejecutar el query si no hay un cultivo seleccionado
  });

  // Obtener la URL de la imagen más reciente
  const recentImage = imageData?.cropMedias[0];

  // Actualización automática de estadísticas
  useEffect(() => {
    const interval = setInterval(() => {
      refetch(); // Refresca las estadísticas cada 30 segundos
      refetchImage(); // Refresca la imagen cada 30 segundos
    }, 30000); // 30,000 ms (30 segundos)

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, [refetch, refetchImage]);

  const statistics = data?.statistics || [];
  const labels = statistics.map((stat) => new Date(stat.timestamp).toLocaleTimeString()).reverse();

  // Obtener el último valor de cada parámetro
  const lastTemperature = statistics[0]?.air_temperature;
  const lastHumidity = statistics[0]?.air_humidity;
  const lastSoilMoisture = statistics[0]?.soil_moisture;

  // Dataset dinámico según el parámetro seleccionado
  const datasets = [
    {
      label: selectedParameter === 'air_humidity'
        ? 'Humedad del Aire (%)'
        : selectedParameter === 'soil_moisture'
          ? 'Humedad del Suelo (%)'
          : 'Temperatura (°C)', // Cambiado a "Temperatura"
      data: statistics.map((stat) => stat[selectedParameter]).reverse(),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      tension: 0.4,
    },
  ];

  // Realizar la petición para obtener los datos del cultivo
  const { loading, error, data: cropData } = useQuery(GET_CROP_INFO, {
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
  const crop = cropData?.crop;

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']}
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
                  value={true}
                  onValueChange={toggleSwitch}
                  color="#65a30d"
                  thumbColor="#d1d5db"
                  disabled={true}
                />
              </View>
            </View>
          </View>
          <View>
            <TouchableOpacity onPress={() => setImages(true)}>
              <Card style={styles.card}>  {/* Utilizando el estilo 'card' para asegurar que tenga el tamaño adecuado */}
                <Card.Content style={styles.content}>
                  <Image
                    source={{ uri: recentImage?.address }}
                    style={styles.image}
                  />
                </Card.Content>
              </Card>
            </TouchableOpacity>

          </View>
          <View>
            <View style={styles.stadisticsContainer}>
              <Button
                icon="coolant-temperature"
                mode="contained"
                buttonColor="#e0f2fe"
                labelStyle={{ color: "#0ea5e9" }}
                style={{ margin: 0 }}
                onPress={() => setSelectedParameter('air_temperature')}>
                {lastTemperature ? `${lastTemperature}°C` : '...'}
              </Button>
              <Button
                icon="air-humidifier"
                mode="contained"
                buttonColor="#e0f2fe"
                labelStyle={{ color: "#0ea5e9" }}
                style={{ margin: 0 }}
                onPress={() => setSelectedParameter('air_humidity')}>
                {lastHumidity ? `${lastHumidity}%` : '...'}
              </Button>
              <Button
                icon="water-pump"
                mode="contained"
                buttonColor="#e0f2fe"
                labelStyle={{ color: "#0ea5e9" }}
                style={{ margin: 0 }}
                onPress={() => setSelectedParameter('soil_moisture')}>
                {lastSoilMoisture ? `${lastSoilMoisture}%` : '...'}
              </Button>
            </View>
          </View>
          <CropChart labels={labels} datasets={datasets} />
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
  card: {
    marginVertical: 16,
    width: '100%',  // Asegúrate de que el Card ocupe el ancho completo
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
  content: {
    padding: 15,  // Opcional: Si no quieres padding adicional alrededor de la imagen
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,  // Ajusta la altura de la imagen según sea necesario
    resizeMode: 'cover',  // Esto asegura que la imagen se ajusta al tamaño del contenedor sin distorsionarse
  },
});
