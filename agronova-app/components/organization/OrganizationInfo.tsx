import { StyleSheet, View, Alert, Text, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/widgets/ThemedText';
import { ThemedView } from '@/components/widgets/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
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

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']}
      style={{ flex: 1 }}
    >
      <ThemedView style={{ flex: 1, padding: 16 }} lightColor="transparent" darkColor="transparent">
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.titleText}>Rancho "Las Camelinas"</ThemedText>
          <ThemedText style={styles.descriptionText}>
            Empresa líder en producción de maíz a nivel nacional, con más de 30 años de experiencia en el sector.
          </ThemedText>
          {/* Aquí llamas al componente MembersList */}
          <MembersList />
        </View>
        {/* Botón para eliminar rancho */}
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