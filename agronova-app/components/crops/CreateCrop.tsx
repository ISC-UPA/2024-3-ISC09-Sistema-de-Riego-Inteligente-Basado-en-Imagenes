import React, { useState, useContext } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { CropContext } from '@/components/context/CropContext';

const CrearCultivoScreen: React.FC = () => {

  const [nombre, setNombre] = useState('');
  const cropContext = useContext(CropContext);

  // Verifica que cropContext no sea undefined
  if (!cropContext) {
    throw new Error('CropContext debe estar dentro del proveedor CropProvider');
  }

  const { setAddCrop, setUpdateCrop, updateCrop } = cropContext; // Obtenemos setRecord del contexto

  // Función para solo modificar `record`
  const handleBackPress = () => {
    setAddCrop(false); // Cambiamos `record` a false sin afectar el selectedCropId
    setUpdateCrop(false);
  };

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd','#7dd3fc']} 
      style={{ flex: 1 }}
    >
        <View style={styles.container}>
        {/* Formulario */}
        <View style={styles.formContainer}>
            <Text style={styles.titleText}>Crear nuevo cultivo</Text>
            <TextInput
            label="Nombre"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
            mode = 'outlined'
            theme={{ colors: { primary: '#0284c7', outline: '#ffffff' } }}
            />

            <TextInput
            label="Ubicación"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
            mode = 'outlined'
            theme={{ colors: { primary: '#0284c7', outline: '#ffffff' } }}
            />

            <TextInput
            label="Número de serie"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
            mode = 'outlined'
            theme={{ colors: { primary: '#0284c7', outline: '#ffffff' } }}
            />

            {/* Botones */}
            <View style={styles.buttonContainer}>
            <Button 
                mode="contained" 
                labelStyle={{ color: "#0284c7", }}
                //onPress={() => router.back()} // Regresar a la pantalla anterior
                onPress={handleBackPress}
                buttonColor={'#bae6fd'}
                style={styles.button}
            >
                Cancelar
            </Button>
            <Button 
                mode="contained" 
                onPress={handleBackPress}
                buttonColor={'#0284c7'}
                style={styles.button}
            >
              {updateCrop? 'Actualizar': 'Crear'}
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

export default CrearCultivoScreen;
