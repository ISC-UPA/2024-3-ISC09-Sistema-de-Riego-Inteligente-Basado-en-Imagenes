import React, { useContext, useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { ThemedView } from '@/components/widgets/ThemedView';
import { CropContext } from '@/components/context/CropContext';
import { CropChart} from '@/components/crops/CropChart';
import { useQuery } from '@apollo/client';
import { GET_STATISTICS } from '@/api/queries/queryStatistics';

export default function CropStatisticsScreen() {
  const cropContext = useContext(CropContext);

  // Verifica que cropContext no sea undefined
  if (!cropContext) {
    throw new Error('CropContext debe estar dentro del proveedor CropProvider');
  }

  const { setStatistics } = cropContext; // Obtenemos setRecord del contexto

  // Función para solo modificar `record`
  const handleBackPress = () => {
    setStatistics(false); // Cambiamos `record` a false sin afectar el selectedCropId
  };

  const [isAutomatic, setIsAutomatic] = useState(false);
  const toggleSwitch = () => setIsAutomatic(!isAutomatic);

  const cropId = 'cm3t93jz20003132a1t9jyywo';
  
  const { data } = useQuery(GET_STATISTICS, {
    variables: {
      where: {
        crop_id: {
          id: {
            equals: cropId,
          },
        },
      },
    },
  });

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  // Procesar datos cuando la consulta se complete
  useEffect(() => {
    if (data) {
      const labels = data.statistics.map((stat) => new Date(stat.timestamp).toLocaleDateString());
      const datasets = [
        {
          label: 'Humedad del Aire (%)',
          data: data.statistics.map((stat) => stat.air_humidity),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Temperatura del Aire (°C)',
          data: data.statistics.map((stat) => stat.air_temperature),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
        {
          label: 'Humedad del Suelo (%)',
          data: data.statistics.map((stat) => stat.soil_moisture),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ];

      setChartData({ labels, datasets });
    }
  }, [data]);     

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd','#7dd3fc']} 
      style={{ flex: 1 }}
    >
      <View style={styles.headerContainer}>
        <IconButton
          icon="chevron-left"
          size={24}
          onPress={handleBackPress} // Llamamos a handleBackPress cuando se presiona la flecha
        />
        <Text style={styles.titleText}>Estadística del cultivo X</Text>
      </View>
      <ThemedView 
        style={{ flex: 1, padding: 16 }}
        lightColor="transparent"
        darkColor="transparent"
      >

        <CropChart labels={chartData.labels} datasets={chartData.datasets}/>

      </ThemedView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0c4a6e',
  },
});
