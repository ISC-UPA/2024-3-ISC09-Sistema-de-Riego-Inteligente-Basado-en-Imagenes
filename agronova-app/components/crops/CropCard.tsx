import * as React from 'react';
import { Card, IconButton, Button } from 'react-native-paper';
import { Text, StyleSheet } from 'react-native';

export default function CropCard() {
    return(
  <Card style={styles.card}>
    <Card.Content style={styles.content}>
      <Text style={styles.text}>Cultivo A</Text>
    </Card.Content>
    <Card.Actions style={styles.actions}>
      <IconButton
        icon="eye"  // Usamos el icono de 'react-native-paper'
        onPress={() => console.log('Editar')}
        iconColor={'#84cc16'}
        style={styles.iconButton}
        size={18}
      />
      <IconButton
        icon="pencil"  // Usamos el icono de 'react-native-paper'
        onPress={() => console.log('Editar')}
        iconColor={'#84cc16'}
        style={styles.iconButton}
        size={18}
      />
      <IconButton
        icon="trash-can"  // Usamos el icono de 'react-native-paper'
        onPress={() => console.log('Borrar')}
        iconColor={'#84cc16'}
        style={styles.iconButton}
        size={18}
      />
    </Card.Actions>
  </Card>
    )
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0f9ff',
    margin: 10,
  },
  content: {
    justifyContent: 'center',
    height: 60, // Ajuste opcional para la altura
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
    backgroundColor: 'white', // Fondo blanco para los botones
    marginLeft: 10,
  },
});

