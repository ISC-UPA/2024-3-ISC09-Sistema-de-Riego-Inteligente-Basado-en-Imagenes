import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import SideMenu from '../widgets/SideMenu';
import { Button } from 'react-native-paper';

interface HelpCardProps {
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
}

export default function HelpScreen() {
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible); // Alternar la visibilidad del drawer
  };

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']}
      style={{ flex: 1 }}
    >
      <Stack.Screen options={{ title: '', headerShown: false }} />
      {/* Header con logo y botón de menú */}
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/logo_text.png')}
          style={styles.logo}
        />
        <TouchableOpacity onPress={toggleDrawer}>
          <Ionicons
            name="menu"
            size={24}
            color={'#4d7c0f'}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      </View>

      {/* Contenido de la pantalla de ayuda */}
      <View style={styles.container}>
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

        {/* El botón de regresar al inicio se coloca al final con marginTop: 'auto' */}
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            labelStyle={{ color: "#0284c7" }}
            onPress={() => router.push('(tabs)')}
            buttonColor={'#bae6fd'}
          >
            Regresar al inicio      
          </Button>
        </View>

         {/* Drawer personalizado */}
        <SideMenu visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
      </View>
    </LinearGradient>
  );
}

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 10,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#cae9ff',
  },
  logo: {
    width: 200,
    height: 50,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  buttonContainer: {
    marginTop: 'auto', // Empuja el botón hacia el final del contenedor
    paddingBottom: 16, // Añadir un poco de espacio debajo
  },
});
