import React, { useState, useContext } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useMutation } from '@apollo/client';
import { CREATE_CROP } from '@/api/queries/queryUsers';
import { CropContext } from '@/components/context/CropContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateCropScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const cropContext = useContext(CropContext);

  if (!cropContext) {
    throw new Error('CropContext must be used within a CropProvider');
  }

  const { setAddCrop, setUpdateCrop, updateCrop } = cropContext;

  const [createCrop] = useMutation(CREATE_CROP, {
    onCompleted: (data) => {
      Alert.alert('Success', 'The crop has been successfully created');
      setAddCrop(false);
    },
    onError: (error) => {
      Alert.alert('Error', `There was an issue creating the crop: ${error.message}`);
    },
  });

  const handleCreateCrop = async () => {
    if (!name.trim() || !location.trim() || !deviceId) {
      setErrorMessage('Todos los campos son obligatorios');
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    setErrorMessage('');

    try {
      const userId = await AsyncStorage.getItem('userId');
      const ranchId = await AsyncStorage.getItem('ranchId');

      if (!userId || !ranchId) {
        Alert.alert('Error', 'Failed to retrieve user or ranch information');
        return;
      }

      createCrop({
        variables: {
          data: {
            crop_name: name,
            location: location,
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
      Alert.alert('Error', 'There was an issue retrieving data from AsyncStorage');
    }
  };

  const handleBackPress = () => {
    setAddCrop(false);
    setUpdateCrop(false);
  };

  return (
    <LinearGradient colors={['#f0f9ff', '#e0f2fe', '#bae6fd','#7dd3fc']} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.titleText}>Create New Crop</Text>
          <TextInput
            label="Nombre"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode='outlined'
            theme={{ colors: { primary: '#0284c7', outline: '#ffffff' } }}
          />
          <TextInput
            label="Ubicación"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
            mode='outlined'
            theme={{ colors: { primary: '#0284c7', outline: '#ffffff' } }}
          />
          <TextInput
            label="Número de serie"
            value={deviceId}
            onChangeText={setDeviceId}
            style={styles.input}
            mode='outlined'
            theme={{ colors: { primary: '#0284c7', outline: '#ffffff' } }}
          />
          <View style={styles.buttonContainer}>
            <Button 
              mode="contained" 
              labelStyle={{ color: "#0284c7" }}
              onPress={handleBackPress}
              buttonColor={'#bae6fd'}
              style={styles.button}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleCreateCrop}
              buttonColor={'#0284c7'}
              style={styles.button}
            >
              {updateCrop ? 'Update' : 'Create'}
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
});

export default CreateCropScreen;
