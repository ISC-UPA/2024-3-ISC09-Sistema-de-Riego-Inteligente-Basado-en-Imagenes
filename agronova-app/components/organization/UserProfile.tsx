
import React, { useContext, useEffect, useState } from 'react'; 
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrganizationContext } from '../context/OrganizationContext';

export default function ProfileScreen() {
  const router = useRouter();

  const organizationContext = useContext(OrganizationContext);

  if (!organizationContext) {
    throw new Error('organization context debe ser utilizado dentro de un OrganizationProvider');
  }

  const {setUpdateMember, setViewMember, setSelectedUserId,
          setSelectedUserName, setSelectedUserPhone, setSelectedUserRole} = organizationContext;

  // Estado para almacenar el nombre completo, correo electrónico y rol de usuario
  const [userFullName, setUserFullName] = useState<string>('Nombre no disponible');
  const [userId, setUserId] = useState<string>('Id no disponible');
  const [userEmail, setUserEmail] = useState<string>('Email no disponible');
  const [userRole, setUserRole] = useState<string>('Rol no disponible');
  const [userPhone, setUserPhone] = useState<string>('Número de telefono no disponible');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        const fullName = await AsyncStorage.getItem('userFullName');
        const email = await AsyncStorage.getItem('userEmail');
        const role = await AsyncStorage.getItem('userRole'); // Obtener el rol del usuario
        const phone = await AsyncStorage.getItem('userPhoneNumber'); // Obtener el rol del usuario

        if (id) {
          setUserId(id); // Asigna el nombre del usuario si existe
        }

        if (fullName) {
          setUserFullName(fullName); // Asigna el nombre del usuario si existe
        }

        if (email) {
          setUserEmail(email); // Asigna el email del usuario si existe
        }

        if (role) {
          setUserRole(role); // Asigna el rol del usuario si existe
        }

        if(phone){
          setUserPhone(phone);
        }
      } catch (error) {
        console.error('Error al obtener la información del usuario de AsyncStorage', error);
      }
    };

    fetchUserInfo(); // Llamada a la función al montar el componente
  }, []);

  const handleUpdateUser = (userId : any, name : any, phone : any, role : any) => {
    router.push('/organization')
    setUpdateMember(true)
    setSelectedUserId(userId);
    setSelectedUserName(name);
    setSelectedUserPhone(phone);
    setSelectedUserRole(role);
  }

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
        <Text style={styles.name}>{userFullName}</Text>
        <Text style={styles.email}>{userEmail}</Text>
        <Text style={styles.email}>{userPhone}</Text>
        <Text style={styles.role}>{userRole}</Text> {/* Mostrando dinámicamente el rol del usuario */}

        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            buttonColor="#0284c7"
            textColor="#fff"
            onPress={() => handleUpdateUser(userId, userFullName, userPhone, userRole )}
            style={styles.button}
          >
            Editar perfil
          </Button>

          <Button 
            buttonColor="#7dd3fc"
            textColor="#0284c7"
            onPress={() => router.push('(tabs)')}
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
