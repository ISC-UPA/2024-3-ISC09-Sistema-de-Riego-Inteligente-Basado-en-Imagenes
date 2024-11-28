import React, { useState, useContext } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, Text, Image, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { useMutation } from '@apollo/client';
import { CREATE_RANCH, UPDATE_USER_STATUS } from '@/api/queries/queryUsers'; 

const CreateRanchScreen: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [createRanch, { loading }] = useMutation(CREATE_RANCH);
  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS);


  const handleCreateRanch = async () => {
    if (!nombre.trim() || !descripcion.trim()) {
      setErrorMessage('Todos los campos son obligatorios');
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    setErrorMessage('');

    try {
      const response = await createRanch({
        variables: {
          data: {
            ranch_name: nombre,
            description: descripcion,
            user: {
              connect: [{ id: userId }]
            }
          }
        }
      });

      if (response.data) {
        await updateUserStatus({
          variables: {
            where: { id: userId },
            data: { accountStatus: 'active' }
          }
        });

        Alert.alert('Éxito', 'Rancho creado y estado de usuario actualizado a activo');
        router.push('(tabs)');
      }
    } catch (error) {
      console.error('Error al crear rancho:', error);
      Alert.alert('Error', 'No se pudo crear el rancho');
    }
  };

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']} 
      style={{ flex: 1 }}
    >
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/logo_text.png')}
          style={styles.logo}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.titleText}>Crear nuevo rancho</Text>
          <TextInput
            label="Nombre"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: '#0284c7', outline: '#ffffff' } }}
          />
          <TextInput
            label="Descripción"
            value={descripcion}
            onChangeText={setDescripcion}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: '#0284c7', outline: '#ffffff' } }}
          />

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <View style={styles.buttonContainer}>
            <Button 
              mode="contained" 
              labelStyle={{ color: "#0284c7" }}
              onPress={() => router.push('/')}
              buttonColor={'#bae6fd'}
              style={styles.button}
            >
              Cancelar
            </Button>
            <Button 
              mode="contained" 
              onPress={handleCreateRanch}
              loading={loading}
              disabled={loading}
              buttonColor={'#0284c7'}
              style={styles.button}
            >
              Crear
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
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 10,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#cae9ff',
  },
  logo: {
    width: 200,
    height: 50,
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

export default CreateRanchScreen;
