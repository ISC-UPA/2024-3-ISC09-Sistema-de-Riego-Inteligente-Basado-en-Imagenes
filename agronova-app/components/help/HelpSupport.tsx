import React, { useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconButton } from 'react-native-paper';
import { OrganizationContext } from '@/components/context/OrganizationContext';

interface HelpCardProps {
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
}

export default function HelpScreen(){

  const organizationContext = useContext(OrganizationContext);

  if (!organizationContext ) {
    throw new Error('HomeScreen debe ser utilizado dentro de un Provider');
  }
  
  const { setHelp } = organizationContext; // Obtenemos setRecord del contexto

  // Función para solo modificar `record`
  const handleBackPress = () => {
    setHelp(false); // Cambiamos `record` a false sin afectar el selectedCropId
  };

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
          <IconButton
            icon="chevron-left"
            size={24}
            onPress={handleBackPress}
          />
        <HelpCard
          title="Línea agronova"
          description="4491271278 Lu - Do, de 06:00 a 23:00 h."
          buttonText="Llamar a Línea agronova"
          onPress={() => alert('Llamando a Línea agronova')}
        />
        <HelpCard
          title="Sede agronova"
          description="Ven a visitarnos."
          buttonText="Ir"
          onPress={() => Linking.openURL('https://maps.app.goo.gl/1QDnKM8esjeVrrAT6')}
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
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Color de la sombra para iOS
    shadowOffset: { width: 0, height: 2 }, // Desplazamiento de la sombra para iOS
    shadowOpacity: 0.25, // Opacidad de la sombra para iOS
    shadowRadius: 3.84, // Radio de la sombra para iOS
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
    backgroundColor: '#0ea5e9',
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

