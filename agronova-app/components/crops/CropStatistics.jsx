import React, { useContext, useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { IconButton } from 'react-native-paper';
import { ThemedView } from '@/components/widgets/ThemedView';
import { CropContext } from '@/components/context/CropContext';
import { CropChart } from '@/components/crops/CropChart';
import { useQuery } from '@apollo/client';
import { GET_STATISTICS_BY_DAY } from '@/api/queries/queryStatistics';

export default function CropStatisticsScreen() {
  const cropContext = useContext(CropContext);

  if (!cropContext) {
    throw new Error('CropContext debe estar dentro del proveedor CropProvider');
  }

  const { setStatistics } = cropContext;

  const handleBackPress = () => {
    setStatistics(false);
  };

  const startDate = new Date('2024-11-27').toISOString();
  const endDate = new Date('2024-11-28').toISOString();
  const cropId = 'cm40jdigj0003k5ivborce77f';

  const { data} = useQuery(GET_STATISTICS_BY_DAY, {
    variables: {
      where: {
        crop_id: { id: { equals: cropId } },  // Filtro por crop_id
        timestamp: {
          gte: startDate,  // Mayor o igual a la fecha de inicio
          lte: endDate,    // Menor o igual a la fecha de fin
        },
      },
    },
  });

  const [chartsData, setChartsData] = useState({
    labels: [],
    airHumidity: [],
    airTemperature: [],
    soilMoisture: [],
  });

  useEffect(() => {
    if (data && data.statistics) {
      // Agrupar datos por fecha
      const groupedData = data.statistics.reduce((acc, stat) => {
        const date = new Date(stat.timestamp).toLocaleDateString(); // Usar fecha como clave
        
        if (!acc[date]) {
          acc[date] = {
            airHumidity: [],
            airTemperature: [],
            soilMoisture: [],
          };
        }

        // Agregar los valores de cada métrica por día
        acc[date].airHumidity.push(stat.air_humidity);
        acc[date].airTemperature.push(stat.air_temperature);
        acc[date].soilMoisture.push(stat.soil_moisture);

        return acc;
      }, {});

      // Calcular los promedios por día
      const labels = [];
      const airHumidity = [];
      const airTemperature = [];
      const soilMoisture = [];

      Object.keys(groupedData).forEach(date => {
        const avgAirHumidity = groupedData[date].airHumidity.reduce((sum, value) => sum + value, 0) / groupedData[date].airHumidity.length;
        const avgAirTemperature = groupedData[date].airTemperature.reduce((sum, value) => sum + value, 0) / groupedData[date].airTemperature.length;
        const avgSoilMoisture = groupedData[date].soilMoisture.reduce((sum, value) => sum + value, 0) / groupedData[date].soilMoisture.length;

        labels.push(date);
        airHumidity.push(avgAirHumidity);
        airTemperature.push(avgAirTemperature);
        soilMoisture.push(avgSoilMoisture);
      });

      // Actualizar el estado con los datos promediados
      setChartsData({ labels, airHumidity, airTemperature, soilMoisture });
    }
  }, [data]);

  return (
    <LinearGradient colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']} style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <IconButton icon="chevron-left" size={24} onPress={handleBackPress} />
        <Text style={styles.titleText}>Estadísticas del Cultivo</Text>
      </View>
      <ScrollView>
        <ThemedView style={{ flex: 1, padding: 16 }} lightColor="transparent" darkColor="transparent">
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Humedad del Aire (%)</Text>
            <CropChart
              labels={chartsData.labels}
              datasets={[
                {
                  label: 'Humedad del Aire',
                  data: chartsData.airHumidity,
                  backgroundColor: 'rgba(255, 165, 0, 0.5)', // Naranja claro
                  borderColor: 'rgba(255, 165, 0, 1)', // Naranja oscuro
                  borderWidth: 1,
                  tension: 0.4,
                },
              ]}
            />
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Temperatura del Aire (°C)</Text>
            <CropChart
              labels={chartsData.labels}
              datasets={[
                {
                  label: 'Temperatura del Aire',
                  data: chartsData.airTemperature,
                  backgroundColor: 'rgba(220, 20, 60, 0.5)', // Rojo claro
                  borderColor: 'rgba(220, 20, 60, 1)', // Rojo oscuro
                  borderWidth: 1,
                  tension: 0.4,
                },
              ]}
            />
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Humedad del Suelo (%)</Text>
            <CropChart
              labels={chartsData.labels}
              datasets={[
                {
                  label: 'Humedad del Suelo',
                  data: chartsData.soilMoisture,
                  backgroundColor: 'rgba(50, 205, 50, 0.5)', // Verde claro
                  borderColor: 'rgba(34, 139, 34, 1)', // Verde oscuro
                  borderWidth: 1,
                  tension: 0.4,
                },
              ]}
            />
          </View>
        </ThemedView>
      </ScrollView>
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
  chartContainer: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
});
