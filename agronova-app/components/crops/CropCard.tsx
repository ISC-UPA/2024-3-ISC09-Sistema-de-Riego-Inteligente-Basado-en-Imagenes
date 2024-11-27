import React, { useEffect, useState, useContext } from 'react';
import { Card, IconButton } from 'react-native-paper';
import { CropContext } from '@/components/context/CropContext'; // Importar el CropContext
import { Text, StyleSheet, View } from 'react-native';
import DeleteConfirmationModal from '@/components/widgets/ConfirmModal'; // Importar el modal

interface CropCardProps {
  id: number;
  name: string;
}

export default function CropCard(props: CropCardProps) {
  const cropContext = useContext(CropContext); // Usar CropContext
  if (!cropContext) {
    throw new Error('CropCard debe ser utilizado dentro de un CropProvider');
  }

  const { selectedCropId, setSelectedCropId, setUpdateCrop } = cropContext; // Acceder al valor y la función del contexto
  const [itemId, setItemId] = useState<number>(0);
  const [isModalVisible, setModalVisible] = useState(false); // Estado del modal
  const [selectedItemName, setSelectedItemName] = useState(''); // Nombre del cultivo seleccionado

  useEffect(() => {
    if (props.id != null) {
      setItemId(props.id);
    }
  }, [props.id]);

  const handleViewDetails = () => {
    console.log('ID del cultivo antes de actualizar:', { itemId });
    setSelectedCropId(itemId); // Actualizar el contexto con el ID del cultivo seleccionado
    console.log('Contexto actualizado con cropId:', selectedCropId);
  };

  const handleEditPress = () => {
    setSelectedCropId(itemId); // Actualizar el contexto con el ID del cultivo seleccionado
    setUpdateCrop(true); // Activar el flag para abrir la ventana de edición
    console.log('Editar cultivo', itemId);
  };

  const handleDeletePress = () => {
    setSelectedItemName(props.name); // Establecer el nombre del cultivo a borrar
    setModalVisible(true); // Mostrar el modal
  };

  const handleConfirmDelete = () => {
    console.log('Cultivo eliminado:', props.name);
    setModalVisible(false); // Cerrar el modal después de confirmar la eliminación
  };

  return (
    <View>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Text style={styles.titleText}>{props.name}</Text>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <IconButton
            icon="eye"
            onPress={handleViewDetails} // Actualizar el contexto al hacer clic
            iconColor={'#84cc16'}
            style={styles.iconButton}
            size={18}
          />
          <IconButton
            icon="pencil"
            onPress={handleEditPress}
            iconColor={'#84cc16'}
            style={styles.iconButton}
            size={18}
          />
          <IconButton
            icon="trash-can"
            onPress={handleDeletePress} // Abre el modal de confirmación
            iconColor={'#84cc16'}
            style={styles.iconButton}
            size={18}
          />
        </Card.Actions>
      </Card>

      {/* Modal de Confirmación */}
      <DeleteConfirmationModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)} // Función para cerrar el modal
        onConfirmDelete={handleConfirmDelete}  // Función para confirmar la eliminación
        itemName={selectedItemName}            // Pasar el nombre del cultivo a eliminar
      />

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0f9ff',
    margin: 10,
  },
  content: {
    justifyContent: 'center',
    height: 60,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0c4a6e',
  },
  actions: {
    justifyContent: 'flex-end',
  },
  iconButton: {
    backgroundColor: 'white',
    marginLeft: 10,
  },
});
