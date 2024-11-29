import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/widgets/ThemedText';
import { ThemedView } from '@/components/widgets/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@apollo/client';
import { GET_USER_RANCH, GET_RANCH_CROPS } from '@/api/queries/queryUsers';
import { OrganizationContext } from '../context/OrganizationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MembersList from './membersList'; // Asegúrate de importar el componente correctamente
import React, { useContext } from 'react';
import { IconButton } from 'react-native-paper';

export default function Organization() {

  const organizationContext = useContext(OrganizationContext);

  if (!organizationContext) {
    throw new Error('CropContext debe estar dentro del proveedor CropProvider');
  }

  const { setUpdateRanch, setRanchName, setRanchDescription } = organizationContext;


  const [userId, setUserId] = React.useState<string | null>(null);
  const [ranchId, setRanchId] = React.useState<string | null>(null);

  // Cargar datos desde AsyncStorage cuando el componente se monta
  React.useEffect(() => {
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
  const { data: userRanchData, loading: userRanchLoading, error: userRanchError } = useQuery(GET_USER_RANCH, {
    variables: { where: { id: userId } },
    skip: !userId, // Solo ejecutar este query si ya tenemos el userId
  });

  const ranchName = userRanchData?.user?.ranch_id?.ranch_name || 'Rancho desconocido';
  const ranchDescription = userRanchData?.user?.ranch_id?.description || 'Sin descripción';

  const handleUpdateRanch = (name : any, description : any) => {
    setUpdateRanch(true)
    setRanchName(name);
    setRanchDescription(description);
  }

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']}
      style={{ flex: 1 }}
    >
      <ThemedView style={{ flex: 1, padding: 16 }} lightColor="transparent" darkColor="transparent">
        <View>
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
});