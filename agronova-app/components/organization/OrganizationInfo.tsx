import { StyleSheet, View, Alert, Text, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/widgets/ThemedText';
import { ThemedView } from '@/components/widgets/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { GET_USER_RANCH } from '@/api/queries/queryUsers';
import { useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MembersList from './membersList'; // Asegúrate de importar el componente correctamente
import React from 'react';

export default function Organization() {

  const handleDeletePress = () => {
    Alert.alert(
      'Eliminar rancho',
      '¿Estás seguro de que deseas eliminar el rancho?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => console.log('Rancho eliminado') }
      ]
    );
  };

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

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']}
      style={{ flex: 1 }}
    >
      <ThemedView style={{ flex: 1, padding: 16 }} lightColor="transparent" darkColor="transparent">
        <View>
          <ThemedText style={styles.titleText}>
            {`Rancho "${ranchName}"`}
          </ThemedText>
          <ThemedText style={styles.descriptionText}>
            {ranchDescription}
          </ThemedText>
          {/* Aquí llamas al componente MembersList */}
          <MembersList />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
            <Text style={styles.buttonText}>Eliminar rancho</Text>
          </TouchableOpacity>
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
  },
  descriptionText: {
    textAlign: 'justify',
    fontSize: 16,
    marginVertical: 10,
    color: '#0c4a6e',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20, // Añadir padding para separar el botón del borde inferior
  },
  deleteButton: {
    backgroundColor: '#ff0000',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25, // Ajustar este valor para hacer el botón más ovalado
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
