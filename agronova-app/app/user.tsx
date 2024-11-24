import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { OrganizationContext } from '@/components/context/OrganizationContext'; // Importa el contexto

export default function ProfileScreen() {
  const router = useRouter();

  // Acceder al contexto
  const organizationContext = useContext(OrganizationContext);

  // Verificar si el contexto está definido
  if (!organizationContext) {
    return <Text>Error: No se ha podido cargar el contexto de la organización.</Text>;
  }

  const { userFullName, userEmail } = organizationContext;

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']}
      style={styles.gradient}
    >
      <Stack.Screen options={{ title: '', headerShown: false }} />
      <View style={styles.container}>
        {/* Avatar del perfil */}
        <Avatar.Image 
          size={120} 
          source={{ uri: 'https://via.placeholder.com/150' }} 
          style={styles.avatar}
        />

        {/* Información del usuario */}
        <Text style={styles.name}>{userFullName || 'Nombre no disponible'}</Text>
        <Text style={styles.email}>{userEmail || 'Email no disponible'}</Text>
        <Text style={styles.role}>Usuario</Text> {/* Puedes cambiar esto dinámicamente si tienes roles */}

        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            buttonColor="#0284c7"
            textColor="#fff"
            onPress={() => alert('Editar perfil')}
            style={styles.button}
          >
            Editar perfil
          </Button>

          <Button 
            buttonColor="#7dd3fc"
            textColor="#0284c7"
            onPress={() => router.push('/')}
            style={styles.button}
          >
            Regresar al inicio
          </Button>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0c4a6e',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#0c4a6e',
    marginBottom: 4,
  },
  role: { 
    fontSize: 16,
    color: '#0c4a6e',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    marginVertical: 10,
    width: '80%',
  },
});
