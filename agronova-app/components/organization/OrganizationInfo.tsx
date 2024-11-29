import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/widgets/ThemedText';
import { ThemedView } from '@/components/widgets/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@apollo/client';
import { GET_USER_RANCH } from '@/api/queries/queryUsers';
import { OrganizationContext } from '../context/OrganizationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MembersList from './membersList';
import { IconButton } from 'react-native-paper';
import DeleteConfirmationModal from '@/components/widgets/DeleteRanchModal'; // Importa el modal aquí

export default function Organization() {
  const organizationContext = useContext(OrganizationContext);

  if (!organizationContext) {
    throw new Error('OrganizationContext debe estar dentro del proveedor OrganizationProvider');
  }

  const { setViewUpdateRanch, setRanchName, setRanchDescription, reFetchOrganization, setReFetchOrganization } = organizationContext;

  const [userId, setUserId] = useState<string | null>(null);
  const [ranchId, setRanchId] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Estado para controlar el modal

  // Cargar datos desde AsyncStorage cuando el componente se monta
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedRanchId = await AsyncStorage.getItem('ranchId');
        if (storedUserId) {
          setUserId(storedUserId);
        }
        if (storedRanchId) {
          setRanchId(storedRanchId);
        }
      } catch (error) {
        console.error('Error al cargar datos desde AsyncStorage', error);
      }
    };

    loadUserData();
  }, []);

  // Query para obtener el rancho del usuario
  const { data: userRanchData, loading: userRanchLoading, error: userRanchError, refetch } = useQuery(GET_USER_RANCH, {
    variables: { where: { id: userId } },
    skip: !userId, // Solo ejecutar este query si ya tenemos el userId
  });

  // Si ReFetchOrganization es true, realizar un refetch
  useEffect(() => {
    if (reFetchOrganization && ranchId) {
      refetch();
      setReFetchOrganization(false);
    }
  }, [reFetchOrganization, ranchId, refetch, setReFetchOrganization]);

  const ranchName = userRanchData?.user?.ranch_id?.ranch_name || 'Rancho desconocido';
  const ranchDescription = userRanchData?.user?.ranch_id?.description || 'Sin descripción';

  const handleUpdateRanch = (name: any, description: any) => {
    setViewUpdateRanch(true);
    setRanchName(name);
    setRanchDescription(description);
  };

  const handleSupportPress = () => {
    // Implementa aquí la acción para contactar con soporte
    console.log('Contacto con soporte');
    setDeleteModalVisible(false); // Cierra el modal después de presionar "Soporte"
  };

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']}
      style={{ flex: 1 }}
    >
      <ThemedView style={{ flex: 1, padding: 16 }} lightColor="transparent" darkColor="transparent">
        <View style={{ flex: 1 }}>
          <View style={styles.headerContainer}>
            <ThemedText style={styles.titleText}>
              {`Rancho "${ranchName}"`}
            </ThemedText>
            <IconButton icon="pencil" size={24} onPress={() => handleUpdateRanch(ranchName, ranchDescription)} />
          </View>
          <ThemedText style={styles.descriptionText}>
            {ranchDescription}
          </ThemedText>
          {/* Aquí llamas al componente MembersList */}
          <MembersList />
        </View>

        {/* Botón de eliminar cultivo */}
        <TouchableOpacity style={styles.deleteButton} onPress={() => setDeleteModalVisible(true)}>
          <ThemedText style={styles.buttonLabel}>Eliminar rancho</ThemedText>
        </TouchableOpacity>

        {/* Modal de confirmación de eliminación */}
        <DeleteConfirmationModal
          visible={deleteModalVisible}
          onClose={() => setDeleteModalVisible(false)}
          onSupportPress={handleSupportPress}
        />
      </ThemedView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0c4a6e',
  },
  descriptionText: {
    textAlign: 'justify',
    fontSize: 16,
    marginVertical: 10,
    color: '#0c4a6e',
  },
  deleteButton: {
    position: 'absolute', // Fijar el botón al fondo
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
