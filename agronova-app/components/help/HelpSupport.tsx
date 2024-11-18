import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface HelpCardProps {
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
}

const HelpScreen = () => {
  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <HelpCard
          title="Línea BBVA"
          description="55 5226 2663\nLu - Do, de 06:00 a 23:00 h."
          buttonText="Llamar a Línea BBVA"
          onPress={() => alert('Llamando a Línea BBVA')}
        />
        <HelpCard
          title="Tarjeta rechazada"
          description="¿Tu pago no pasó y no sabes por qué? Contáctanos."
          buttonText="Llamar asesor"
          onPress={() => alert('Llamando a asesor')}
        />
        <HelpCard
          title="Videollamada en Lengua de Señas Mexicana"
          description="Apoyamos a personas sordas a resolver dudas que tengan de los servicios del banco."
          buttonText="Iniciar videollamada"
          onPress={() => alert('Iniciando videollamada')}
        />
      </View>
    </LinearGradient>
  );
};

const HelpCard: React.FC<HelpCardProps> = ({ title, description, buttonText, onPress }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0c4a6e',
  },
  description: {
    fontSize: 14,
    color: '#0c4a6e',
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#0c4a6e',
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HelpScreen;
