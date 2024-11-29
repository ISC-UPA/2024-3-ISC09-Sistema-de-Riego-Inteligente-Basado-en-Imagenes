import * as React from 'react';
import AddButton from '@/components/widgets/AddButton';
import CropCard from '@/components/crops/CropCard';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/widgets/ThemedText';
import { ThemedView } from '@/components/widgets/ThemedView';
import { StyleSheet, ScrollView, ActivityIndicator, Text, View } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_USER_RANCH, GET_RANCH_CROPS, GET_USER_CROPS } from '@/api/queries/queryUsers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CropContext } from '@/components/context/CropContext';
import ParallaxScrollView from '../widgets/ParallaxScrollView';

export default function CropList() {
  const [userId, setUserId] = React.useState<string | null>(null);
  const [ranchId, setRanchId] = React.useState<string | null>(null);
  const [userRole, setUserRole] = React.useState<string | null>(null); // Nuevo estado para el rol del usuario

  // Obtener el contexto de cultivos
  const cropContext = React.useContext(CropContext);
  if (!cropContext) {
    throw new Error('CropContext debe estar dentro de un CropProvider');
  }

  const { reFetchCrop, setReFetchCrop } = cropContext;

  // Cargar datos desde AsyncStorage cuando el componente se monta
  React.useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedRanchId = await AsyncStorage.getItem('ranchId');
        const storedUserRole = await AsyncStorage.getItem('userRole'); // Obtener el rol del usuario desde AsyncStorage
        if (storedUserId) {
          setUserId(storedUserId);
        }
        if (storedRanchId) {
          setRanchId(storedRanchId);
        }
        if (storedUserRole) {
          setUserRole(storedUserRole); // Almacenar el rol del usuario
        }
      } catch (error) {
        console.error('Error al cargar datos desde AsyncStorage', error);
      }
    };

    loadUserData();
  }, []);

  // Condicionar la consulta según el rol del usuario
  const isAdminOrAgronomist = userRole === 'Administrador' || userRole === 'Agrónomo';

  const query = isAdminOrAgronomist ? GET_RANCH_CROPS : GET_USER_CROPS;
  const variables = isAdminOrAgronomist
    ? { where: { id: ranchId }, cropWhere2: { isDeleted: { equals: false } } }
    : { where: { id: userId }, cropsWhere2: { isDeleted: { equals: false } } };

  // Ejecutar la consulta adecuada según el rol
  const { data, loading, error, refetch } = useQuery(query, {
    variables,
    skip: (!userId && !ranchId) || !userRole, // Ejecutar solo si tenemos el userId, ranchId y el rol
  });

  // Refetch crops cuando reFetchCrop es true
  React.useEffect(() => {
    if (reFetchCrop && ranchId) {
      refetch(); // Hacemos el refetch de los cultivos
      setReFetchCrop(false); // Resetear reFetchCrop para que no se repita el refetch innecesariamente
    }
  }, [reFetchCrop, ranchId, refetch, setReFetchCrop]);

  // Manejo de estados de carga y error
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error al cargar los datos</Text>;
  }

  const crops = isAdminOrAgronomist ? data?.ranch?.crop || [] : data?.user?.crops || [];
  const ranchName = data?.user?.ranch_id?.ranch_name || 'Rancho desconocido';

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']}
      style={{ flex: 1 }}
    >
      <ThemedView style={{ flex: 1 }} lightColor="transparent" darkColor="transparent">
        {/* Nombre del rancho */}
        <ThemedText style={styles.titleText}>{`Rancho "${ranchName}"`}</ThemedText>
        {/* Lista de cultivos */}
        <ParallaxScrollView>
          {crops.length > 0 ? (
            crops.map((crop: any) => <CropCard key={crop.id} {...crop} />)
          ) : (
            <ThemedText>No hay cultivos disponibles</ThemedText>
          )}
        </ParallaxScrollView>
        <View>
        {userRole === 'Administrador' || userRole === 'Agrónomo' ? (
          <AddButton />)
        : null}
        </View>
      </ThemedView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0c4a6e',
    margin: 20,
  },
});
