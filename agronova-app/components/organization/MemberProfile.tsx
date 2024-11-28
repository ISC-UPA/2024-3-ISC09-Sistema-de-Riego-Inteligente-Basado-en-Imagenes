import React, { useContext, useEffect, useState } from 'react'; 
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Avatar } from 'react-native-paper';
import { OrganizationContext } from '../context/OrganizationContext';

export default function ProfileScreen() {
  const organizationContext = useContext(OrganizationContext);

  if (!organizationContext) {
    throw new Error('organization context debe ser utilizado dentro de un OrganizationProvider');
  }

  const { selectedUserName, selectedUserPhone, selectedUserRole,userEmail, setViewMember } = organizationContext; // Usamos el email del usuario desde el contexto

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {/* Avatar del perfil */}
        <Avatar.Image 
          size={120} 
          source={{ uri: 'https://via.placeholder.com/150' }} 
          style={styles.avatar}
        />

        {/* Información del usuario */}
        <Text style={styles.name}>{selectedUserName}</Text>
        <Text style={styles.email}>{userEmail}</Text>
        <Text style={styles.phone}>{selectedUserPhone}</Text>
        <Text style={styles.role}>{selectedUserRole}</Text>

        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          <Button 
            buttonColor="#7dd3fc"
            textColor="#0284c7"
            onPress={() => setViewMember(false)}
            style={styles.button}
          >
            Regresar
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
  phone: {
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
