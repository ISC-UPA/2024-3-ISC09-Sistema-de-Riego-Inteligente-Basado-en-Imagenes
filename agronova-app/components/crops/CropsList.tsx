import * as React from 'react';
import AddButton from '@/components/widgets/AddButton';
import CropCard from '@/components/crops/CropCard';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/widgets/ThemedText';
import { ThemedView } from '@/components/widgets/ThemedView';
import { StyleSheet, ScrollView, ActivityIndicator, Text } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_USER_RANCH, GET_RANCH_CROPS } from '@/api/queries/queryUsers';
import { OrganizationContext } from '../context/OrganizationContext';

export default function CropList() {
  const organizationContext = React.useContext(OrganizationContext);

  if (!organizationContext) {
    throw new Error('OrganizationContext debe estar dentro de un proveedor OrganizationProvider');
  }

  const { userId } = organizationContext;

  // Query para obtener el rancho del usuario
  const { data: userRanchData, loading: userRanchLoading, error: userRanchError } = useQuery(GET_USER_RANCH, {
    variables: { where: { id: userId } },
  });

  // Extraer el ID del rancho
  const ranchId = userRanchData?.user?.ranch_id?.id;

  // Query para obtener los cultivos del rancho
  const { data: ranchCropsData, loading: ranchCropsLoading, error: ranchCropsError } = useQuery(GET_RANCH_CROPS, {
    variables: { where: { id: ranchId }, cropWhere2: { isDeleted: { equals: false } } },
    skip: !ranchId, // Solo ejecutar este query si ya tenemos el ranchId
  });

  // Manejo de estados de carga y error
  if (userRanchLoading || ranchCropsLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (userRanchError || ranchCropsError) {
    return <Text>Error al cargar los datos</Text>;
  }

  const ranchName = userRanchData?.user?.ranch_id?.ranch_name || 'Rancho desconocido';
  const crops = ranchCropsData?.ranch?.crop || [];

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd','#7dd3fc']} 
      style={{ flex: 1 }}
    >
      <ThemedView style={{ flex: 1, padding: 16 }}
        lightColor="transparent"
        darkColor="transparent"
      >
        {/* Ranch name */}
        <ThemedText style={styles.titleText}>
          {`Rancho "${ranchName}"`}
        </ThemedText>

        {/* Button to add new crop */}
        <AddButton />

        {/* Crops list */}
        <ScrollView style={{ marginVertical: 25 }}>
          {crops.length > 0 ? (
            crops.map((crop: any) => <CropCard key={crop.id} {...crop} />)
          ) : (
            <ThemedText>No hay cultivos disponibles</ThemedText>
          )}
        </ScrollView>
      </ThemedView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0c4a6e',
  },
});
