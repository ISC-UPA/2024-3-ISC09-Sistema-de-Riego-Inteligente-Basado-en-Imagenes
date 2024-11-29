import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { IconButton, Button } from 'react-native-paper';
import ActivityIndicator from 'react-native-paper';

interface LoadingModalProps {
  visible: boolean; // Controla si el modal está visible o no
 // onClose: () => void; // Función para cerrar el modal
}

export default function LoadingModal({
  visible,
  //onClose,
}: LoadingModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      //onRequestClose={onClose}
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
            Cargando ....
          </Text>
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
  warningIcon: {
    marginBottom: 10,
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
});
