import React, { useState, useContext, useEffect } from 'react'; 
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_CROP, UPDATE_CROP_INFO, GET_DEVICES } from '@/api/queries/queryUsers';
import { CropContext } from '@/components/context/CropContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Platform } from 'react-native';

const CreateCropScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUpdate, setIsUpdate] = useState(false); // Para detectar si estamos actualizando un cultivo
  const cropContext = useContext(CropContext);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  if (!cropContext) {
    throw new Error('CropContext must be used within a CropProvider');
  }

  const { setAddCrop, setUpdateCrop, updateCrop, selectedCropId, selectedCropName, 
    selectedCropLocation, setReFetchCrop, setSelectedCropId } = cropContext;

  // Mutaciones
  const [createCrop] = useMutation(CREATE_CROP, {
    onCompleted: () => {
      // Establece reFetchCrop a true
      setReFetchCrop(true);
      setAddCrop(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const [updateCropMutation] = useMutation(UPDATE_CROP_INFO, {
    onCompleted: () => {
      // Establece reFetchCrop a true
      setReFetchCrop(true);
      setUpdateCrop(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Efecto para manejar la actualización del cultivo
  useEffect(() => {
    if (updateCrop) {
      setIsUpdate(true);
      setName(selectedCropName || '');
      setLocation(selectedCropLocation || '');
    } else {
      // Si no estamos actualizando, limpiamos los campos
      setName('');
      setLocation('');
    }
  }, [updateCrop, selectedCropName, selectedCropLocation]);

  const handleCreateCrop = async () => {
    if (!name.trim() || !location.trim()) {
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
            users: {
              connect: [{ id: userId }], // Conecta el usuario al cultivo
            },
            ranch_id: {
              connect: { id: ranchId }, // Conecta el rancho al cultivo
            },
            device: {
              connect: { id: selectedDevice },
            }
          },
        },
      });
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al obtener datos de AsyncStorage');
    }
  };

  // Ejecuta el query para obtener los dispositivos (si lo necesitas)
  const { loading, error, data } = useQuery(GET_DEVICES);

  // Maneja el caso de que la data esté cargando o haya errores
  if (loading) return <Text>Cargando dispositivos...</Text>;
  if (error) return <Text>Error al cargar dispositivos</Text>;

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
          },
        },
      });
      setSelectedCropId(null);
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al actualizar el cultivo');
    }
  };

  const handleBackPress = () => {
    setAddCrop(false);
    setUpdateCrop(false);
    setSelectedCropId(null);
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
          {!updateCrop && (
            <View style={styles.pickerWrapper}>
              {/* Label similar to TextInput */}
              <Text style={[styles.label, isFocused ? styles.labelFocused : styles.labelNotFocused]}>
                Dispositivo
              </Text>

              <View style={[styles.pickerContainer, isFocused ? styles.pickerFocused : null]}>
                <Picker
                  selectedValue={selectedDevice}
                  onValueChange={(itemValue) => {
                    setSelectedDevice(itemValue);
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  style={styles.picker}
                  mode="dropdown"
                >
                  {data?.devices.map((device: { id: string; serial_number: string }) => (
                    <Picker.Item key={device.id} label={device.serial_number} value={device.id} />
                  ))}
                </Picker>
              </View>
            </View>
          )}
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
  pickerWrapper: {
    marginVertical: 10,
    position: 'relative',
    width: '100%',  // Asegura que el contenedor tenga un ancho completo
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#0284c7', // Color principal (#0284c7)
    borderRadius: 4,
    height: 56, // Ajuste de altura
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: '100%',  // Asegura que el Picker ocupe todo el espacio disponible
  },
  pickerFocused: {
    borderColor: '#0284c7', // Color de borde cuando está enfocado
  },
  picker: {
    color: '#0284c7', // Color del texto en el picker
    height: '100%',
    width: '100%',  // Asegura que el Picker ocupe todo el espacio disponible en el contenedor
    fontFamily: 'sans-serif',
    fontSize: 16,
    ...Platform.select({
      android: {
        color: '#0284c7', // Color del texto en Android
      },
      ios: {
        height: '100%', // Ajuste de altura para iOS
      },
    }),
  },
  label: {
    position: 'absolute',
    top: 18,
    left: 5,
    fontSize: 16,
    color: '#6e6e6e', // Color gris claro de la etiqueta
    zIndex: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
  },
  labelNotFocused: {
    position: 'absolute',
    top: 18,
    left: 5,
    fontSize: 16,
    color: '#6e6e6e', // Color gris claro de la etiqueta
    zIndex: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    width: 300,  // Aplica el ancho cuando no está enfocado
  },
  labelFocused: {
    top: -8,
    left: 8,
    fontSize: 12,
    color: '#0284c7', // Color de la etiqueta cuando está enfocada
  },
});

export default CreateCropScreen;
