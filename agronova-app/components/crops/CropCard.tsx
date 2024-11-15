import React, { useEffect, useState, useContext } from 'react';
import { Card, IconButton } from 'react-native-paper';
import { CropContext } from '@/components/context/CropContext'; // Importar el CropContext
import { Text, StyleSheet } from 'react-native';

interface CropCardProps {
  id: number;
  name: string;
}

export default function CropCard(props: CropCardProps) {
  const cropContext = useContext(CropContext); // Usar CropContext
  if (!cropContext) {
    throw new Error('CropCard debe ser utilizado dentro de un CropProvider');
  }

  const { selectedCropId, setSelectedCropId } = cropContext; // Acceder al valor y la función del contexto
  const [itemId, setItemId] = useState<number>(0);

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

  return (
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
          onPress={() => console.log('Editar cultivo', props.id)}
          iconColor={'#84cc16'}
          style={styles.iconButton}
          size={18}
        />
        <IconButton
          icon="trash-can"
          onPress={() => console.log('Borrar cultivo', props.id)}
          iconColor={'#84cc16'}
          style={styles.iconButton}
          size={18}
        />
      </Card.Actions>
    </Card>
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
  text: {
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actions: {
    justifyContent: 'flex-end',
  },
  iconButton: {
    backgroundColor: 'white',
    marginLeft: 10,
  },
});
