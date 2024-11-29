import React from 'react';
import { Card, Text } from 'react-native-paper';
import { StyleSheet, View, Image } from 'react-native';

export default function IAimageCard({ imageUrl, mediaType, description, date }) {
  // Función para formatear la fecha
  const formatDate = (isoDate) => {
    const dateObject = new Date(isoDate);
    return dateObject.toLocaleDateString('es-ES'); // Formato: dd/mm/yyyy
  };

  return (
    <View>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          {/* Contenedor con flexDirection: 'row' para poner la imagen al lado del texto */}
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <View>
            <Text style={styles.titleText}>{mediaType}</Text> {/* Mostramos el tipo de medio */}
            <Text style={styles.subtitleText}>{description}</Text> {/* Descripción */}
            <Text style={styles.dateText}>Fecha: {formatDate(date)}</Text> {/* Fecha formateada */}
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0f9ff',
    margin: 10,
    borderRadius: 8,
  },
  content: {
    flexDirection: 'row', // Coloca los elementos en una fila
    justifyContent: 'flex-start', // Alinea los elementos al inicio
    alignItems: 'center', // Centra los elementos verticalmente
    padding: 16,
  },
  image: {
    width: 100, // Ancho de la imagen
    height: 100, // Alto de la imagen
    borderRadius: 8, // Esquinas redondeadas de la imagen
    marginRight: 10, // Espacio entre la imagen y el texto
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0c4a6e',
  },
  subtitleText: {
    fontSize: 14,  // Texto más pequeño
    color: '#6b7280',  // Un color gris suave
    marginTop: 4,  // Espacio entre el texto principal y el secundario
  },
  dateText: {
    fontSize: 14,  // Texto para la fecha, tamaño similar al texto secundario
    color: '#6b7280',  // Un color gris suave
    marginTop: 4,  // Espacio entre el texto secundario y la fecha
  },
});
