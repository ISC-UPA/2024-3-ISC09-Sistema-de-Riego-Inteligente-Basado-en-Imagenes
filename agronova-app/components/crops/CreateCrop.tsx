import React, { useState, useContext, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useMutation } from '@apollo/client';
import { CREATE_CROP, UPDATE_CROP_INFO } from '@/api/queries/queryUsers';
import { CropContext } from '@/components/context/CropContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateCropScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [device, setDevice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUpdate, setIsUpdate] = useState(false); // Para detectar si estamos actualizando un cultivo
  const cropContext = useContext(CropContext);

  if (!cropContext) {
    throw new Error('CropContext must be used within a CropProvider');
  }

  const { setAddCrop, setUpdateCrop, updateCrop, selectedCropId, selectedCropName, selectedCropLocation, selectedCropDevice } = cropContext;

  // Mutaciones
  const [createCrop] = useMutation(CREATE_CROP, {
    onCompleted: () => {
      Alert.alert('Éxito', 'El cultivo ha sido creado con éxito');
      setAddCrop(false);
    },
    onError: (error) => {
      Alert.alert('Error', `Hubo un problema al crear el cultivo: ${error.message}`);
    },
  });

  const [updateCropMutation] = useMutation(UPDATE_CROP_INFO, {
    onCompleted: () => {
      Alert.alert('Éxito', 'El cultivo ha sido actualizado con éxito');
      setUpdateCrop(false);
    },
    onError: (error) => {
      Alert.alert('Error', `Hubo un problema al actualizar el cultivo: ${error.message}`);
    },
  });

  // Efecto para manejar la actualización del cultivo
  useEffect(() => {
    if (updateCrop) {
      setIsUpdate(true);
      setName(selectedCropName || ''); // Aseguramos que no sea undefined
      setLocation(selectedCropLocation || ''); // Aseguramos que no sea undefined
      setDevice(selectedCropDevice || ''); // Aseguramos que no sea undefined
    } else {
      // Si no estamos actualizando, limpiamos los campos
      setName('');
      setLocation('');
      setDevice('');
    }
  }, [updateCrop, selectedCropName, selectedCropLocation]);
  const handleCreateCrop = async () => {
    if (!name.trim() || !location.trim() || !device) {
      setErrorMessage('Todos los campos son obligatorios');
      return;
    }
    setErrorMessage('');

    try {
      const userId = await AsyncStorage.getItem('userId');
      const ranchId = await AsyncStorage.getItem('ranchId');

      if (!userId || !ranchId) {
        Alert.alert('Error', 'Error al obtener la información de usuario o rancho');
        return;
      }

      createCrop({
        variables: {
          data: {
            crop_name: name,
            location: location,
            device: {
              connect: {id : device}
            },
            users: {
              connect: [{ id: userId }],
            },
            ranch_id: {
              connect: { id: ranchId },
            },
          },
        },
      });
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al obtener datos de AsyncStorage');
    }
  };

  const handleUpdateCrop = async () => {
    if (!name.trim() || !location.trim()) {
      setErrorMessage('Todos los campos son obligatorios');
      return;
    }
    setErrorMessage('');

    try {
      updateCropMutation({
        variables: {
          where: { id: selectedCropId },
          data: {
            crop_name: name,
            location: location,
            device: device,
          },
        },
      });
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al actualizar el cultivo');
    }
  };

  const handleBackPress = () => {
    setAddCrop(false);
    setUpdateCrop(false);
  };

  return (
    <LinearGradient colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.titleText}>{isUpdate ? 'Actualizar Cultivo' : 'Crear un nuevo cultivo'}</Text>
          <TextInput
            label="Nombre"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: '#0284c7', outline: '#ffffff' } }}
          />
          <TextInput
            label="Ubicación"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: '#0284c7', outline: '#ffffff' } }}
          />
          <TextInput
            label="Número de serie"
            value={device}
            onChangeText={setDevice}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: '#0284c7', outline: '#ffffff' } }}
            disabled={isUpdate} // Deshabilitar si estamos actualizando
          />
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              labelStyle={{ color: '#0284c7' }}
              onPress={handleBackPress}
              buttonColor={'#bae6fd'}
              style={styles.button}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={isUpdate ? handleUpdateCrop : handleCreateCrop}
              buttonColor={'#0284c7'}
              style={styles.button}
            >
              {isUpdate ? 'Actualizar' : 'Crear'}
            </Button>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 16,
  },
  formContainer: {
    marginTop: 16,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0c4a6e',
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default CreateCropScreen;
