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

  const cropId = 'cm40jdigj0003k5ivborce77f';
  const [startDate, setStartDate] = useState('2024-11-26'); // Fecha de inicio predeterminada (ISO)
  const [endDate, setEndDate] = useState('2024-11-27'); // Fecha de fin predeterminada (ISO)
  const [chartsData, setChartsData] = useState({
    labels: [],
    airHumidity: [],
    airTemperature: [],
    soilMoisture: [],
  });

  // Función para transformar fecha a ISO 8601 con hora
  const toISO8601 = (date, isEndOfDay = false) => {
    return isEndOfDay
      ? `${date}T23:59:59.999Z`
      : `${date}T00:00:00.000Z`;
  };

  // Consulta a GraphQL
  const { data, refetch } = useQuery(GET_STATISTICS_BY_DAY, {
    variables: {
      where: {
        crop_id: { id: { equals: cropId } },
        timestamp: {
          gte: toISO8601(startDate), // Fecha de inicio al principio del día
          lte: toISO8601(endDate, true), // Fecha de fin al final del día
        },
      },
    },
    skip: !startDate || !endDate, // Evita ejecutar la consulta sin fechas válidas
  });

  // Lógica para procesar los datos de la consulta
  useEffect(() => {
    if (data && data.statistics) {
      const groupedData = data.statistics.reduce((acc, stat) => {
        const date = stat.timestamp.split('T')[0]; // Extraer fecha (YYYY-MM-DD)
        if (!acc[date]) {
          acc[date] = { airHumidity: [], airTemperature: [], soilMoisture: [] };
        }

        acc[date].airHumidity.push(stat.air_humidity);
        acc[date].airTemperature.push(stat.air_temperature);
        acc[date].soilMoisture.push(stat.soil_moisture);

        return acc;
      }, {});

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

      setChartsData({ labels, airHumidity, airTemperature, soilMoisture });
    }
  }, [data]);

  // Refrescar datos cuando cambian las fechas
  useEffect(() => {
    if (startDate && endDate) {
      refetch();
    }
  }, [startDate, endDate]);

  return (
    <LinearGradient colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']} style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <IconButton icon="chevron-left" size={24} onPress={handleBackPress} />
        <Text style={styles.titleText}>Estadísticas del Cultivo</Text>
      </View>
      <View style={styles.dateContainer}>
        <View>
          <Text>Inicio:</Text>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)} // Actualizar fecha ISO
            style={styles.dateInput}
          />
        </View>
        <View>
          <Text>Fin:</Text>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)} // Actualizar fecha ISO
            style={styles.dateInput}
          />
        </View>
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
                  backgroundColor: 'rgba(255, 165, 0, 0.5)',
                  borderColor: 'rgba(255, 165, 0, 1)',
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
                  backgroundColor: 'rgba(220, 20, 60, 0.5)',
                  borderColor: 'rgba(220, 20, 60, 1)',
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
                  backgroundColor: 'rgba(50, 205, 50, 0.5)',
                  borderColor: 'rgba(34, 139, 34, 1)',
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
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  dateInput: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
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
