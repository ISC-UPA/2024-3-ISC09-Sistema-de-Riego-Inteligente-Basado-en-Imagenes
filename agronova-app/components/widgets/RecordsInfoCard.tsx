import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { CropContext } from '@/components/context/CropContext';  // Asegúrate de importar tu contexto
import { useQuery } from '@apollo/client';
import { GET_LAST_IRRIGATION } from '@/api/queries/queryIrrigations';

export default function InfoCard() {
  const cropContext = useContext(CropContext);  // Obtenemos el contexto completo

  if (!cropContext) {
    return null;  // Si el contexto es undefined, no renderizamos el componente
  }

  const { setRecord } = cropContext;  // Extraemos 'setRecord' del contexto

  const cropId = cropContext.selectedCropId; // Suponiendo que tienes el ID del cultivo en el contexto

  // Query para obtener la última fecha de riego
  const { loading, error, data: irrigationData } = useQuery(GET_LAST_IRRIGATION, {
    variables: {
      where: { crop_id: { id: { equals: cropId } } },
      take: 1,
      orderBy: [{ end_time: 'desc' }],
    },
    skip: !cropId,  // Solo ejecutar la consulta si hay un cultivo seleccionado
  });

  // Si estamos cargando, mostramos un indicador de carga
  if (loading) {
    return <Text>Cargando...</Text>;
  }

  // Si hay error, mostramos el mensaje de error
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  // Obtener la última fecha de riego si los datos están disponibles
  const lastIrrigationTime = irrigationData?.irrigations[0]?.end_time;
  const formattedDate = lastIrrigationTime ? new Date(lastIrrigationTime).toLocaleString() : 'No disponible';

  return (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        {/* Sección del icono de información y texto */}
        <View style={styles.infoContainer}>
          <IconButton icon="information" size={24} />
          <Text style={styles.infoText}>Última fecha de riego: <br /> {formattedDate}</Text>
        </View>

        {/* Botones redondos */}
        <View style={styles.buttonContainer}>
          {/*
          <IconButton
            icon="water"
            size={28}
            mode="contained"
            style={styles.roundButton}
            iconColor="#f0f9ff"
            onPress={() => console.log('Regar')} // Aquí deberías agregar la lógica para realizar el riego
          />
          */}
          <IconButton
            icon="history"
            size={28}
            mode="contained"
            style={styles.roundButton}
            iconColor="#f0f9ff"
            onPress={() => setRecord(true)}  // Aquí puedes activar el historial de registros
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
    padding: 10,
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#0c4a6e',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '50%',
  },
  roundButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 50,
  },
});
