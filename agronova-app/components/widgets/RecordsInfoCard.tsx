import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { CropContext } from '@/components/context/CropContext';  // Asegúrate de importar tu contexto

export default function InfoCard() {
  const cropContext = useContext(CropContext);  // Obtenemos el contexto completo

  if (!cropContext) {
    return null;  // Si el contexto es undefined, no renderizamos el componente
  }

  const { setRecord } = cropContext;  // Extraemos 'setRecord' del contexto

  return (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        {/* Sección del icono de información y texto */}
        <View style={styles.infoContainer}>
          <IconButton icon="information" size={24} />
          <Text style={styles.infoText}>Última fecha de riego: Hace 1 día</Text>
        </View>

        {/* Botones redondos */}
        <View style={styles.buttonContainer}>
          <IconButton
            icon="water"
            size={28}
            mode="contained"
            style={styles.roundButton}
            iconColor="#f0f9ff"
            onPress={() => console.log('Regar')}
          />
          <IconButton
            icon="history"
            size={28}
            mode="contained"
            style={styles.roundButton}
            iconColor="#f0f9ff"
            onPress={() => setRecord(true)}  
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
    justifyContent: 'space-between',
    width: '50%',
  },
  roundButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 50,
  },
});
