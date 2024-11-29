import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Button, IconButton } from 'react-native-paper';

interface DeleteConfirmationModalProps {
  visible: boolean; // Controla si el modal está visible o no
  onClose: () => void; // Función para cerrar el modal
  onSupportPress: () => void; // Función para contactar al soporte
}

export default function DeleteConfirmationModal({
  visible,
  onClose,
  onSupportPress,
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Ícono de advertencia */}
          <IconButton
            icon="alert-circle-outline"
            iconColor={'#fde047'}
            size={40}
            style={styles.warningIcon}
          />
          <Text style={styles.modalText}>
            Si deseas eliminar el rancho debes contactarte con soporte primero.
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={onClose}
              textColor={'#0c4a6e'}
              style={styles.button}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                router.push('/help-and-support');
                onClose();
              }} 
              buttonColor={'#0ea5e9'}
              style={styles.button}
            >
              Soporte
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo gris semi-transparente
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center', // Centrar contenido
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'normal', // Texto sin negrita
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  warningIcon: {
    marginBottom: 10,
  },
});
