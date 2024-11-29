import React, { useState, useContext } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { IconButton } from 'react-native-paper';
import { ThemedView } from '@/components/widgets/ThemedView';
import { CropContext } from '@/components/context/CropContext';
import { DataTable } from 'react-native-paper';
import { GET_IRRIGATIONS } from '@/api/queries/queryIrrigations';
import { useQuery } from '@apollo/client';

export default function CropRecordsScreen() {
  const cropContext = useContext(CropContext);

  // Verifica que cropContext no sea undefined
  if (!cropContext) {
    throw new Error('CropContext debe estar dentro del proveedor CropProvider');
  }

  const { setRecord, selectedCropId } = cropContext; // Obtenemos setRecord y selectedCropId del contexto

  // Función para solo modificar `record`
  const handleBackPress = () => {
    setRecord(false); // Cambiamos `record` a false sin afectar el selectedCropId
  };

  const [isAutomatic, setIsAutomatic] = useState(false);
  const toggleSwitch = () => setIsAutomatic(!isAutomatic);

  // Query para obtener las irrigaciones del cultivo
  const { data, loading, error } = useQuery(GET_IRRIGATIONS, {
    variables: {
      where: {
        crop_id: { id: { equals: selectedCropId } }, // Asegúrate de que selectedCropId tiene un valor válido
      },
    },
  });

  // Manejando estados de carga y error
  if (loading) {
    return <ActivityIndicator size="large" color="#0c4a6e" />;
  }

  if (error) {
    return <Text>Error al cargar las irrigaciones</Text>;
  }

  // Verifica si hay irrigaciones en los datos
  const irrigations = data?.irrigations || []; // Asegúrate de acceder a la propiedad correcta

// Función para formatear las horas en formato DD/MM HH:mm
const formatTime = (time) => {
  const date = new Date(time);
  const day = date.getDate().toString().padStart(2, '0'); // Día con 2 dígitos
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes con 2 dígitos
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day}/${month} ${hours}:${minutes}`; // Fecha sin año + hora
};

// Función para calcular la duración entre dos tiempos
const calculateDuration = (startTime, endTime) => {
  const start = new Date(startTime); // Convertir start_time a objeto Date
  const end = new Date(endTime); // Convertir end_time a objeto Date

  const durationInMs = end - start; // Duración en milisegundos

  const hours = Math.floor(durationInMs / (1000 * 60 * 60)); // Calcular las horas
  const minutes = Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60)); // Calcular los minutos restantes

  return `${hours}h ${minutes}m`; // Retorna la duración en formato "Xh Ym"
};

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
        <Text style={styles.titleText}>Historial del cultivo X</Text>
      </View>
      <ThemedView 
        style={{ flex: 1, padding: 16 }}
        lightColor="transparent"
        darkColor="transparent"
      >
        <DataTable>
          {/* Header */}
          <DataTable.Header>
            <DataTable.Title>
              <Text style={{ color: '#000000', fontWeight: 'bold' }}>Inicio</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={{ color: '#000000', fontWeight: 'bold' }}>Fin</Text>
            </DataTable.Title>
            <DataTable.Title numeric>
              <Text style={{ color: '#000000', fontWeight: 'bold' }}>Duración</Text>
            </DataTable.Title>
          </DataTable.Header>

          {/* Rows */}
          {irrigations.length > 0 ? (
            irrigations.map((item) => (
              <DataTable.Row key={item.id}>
                <DataTable.Cell>
                  <Text style={{ color: '#000000' }}>
                    {formatTime(item.start_time)} {/* Formatea el inicio con día y hora */}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={{ color: '#000000' }}>
                    {formatTime(item.end_time)} {/* Formatea el fin con día y hora */}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={{ color: '#000000' }}>
                    {calculateDuration(item.start_time, item.end_time)} {/* Duración calculada */}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))
          ) : (
            <Text>No hay irrigaciones disponibles</Text>
          )}
        </DataTable>
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
