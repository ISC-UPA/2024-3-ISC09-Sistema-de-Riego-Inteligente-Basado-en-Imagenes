import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button, Switch, Card } from 'react-native-paper';

export default function CultivoScreen() {
  const [isAutomatic, setIsAutomatic] = useState(false);

  const toggleSwitch = () => setIsAutomatic(!isAutomatic);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cultivo X</Text>
      
      <Card style={styles.imageContainer}>
        {/* Aquí va la imagen del cultivo */}
        <Image 
          source={{ uri: 'https://via.placeholder.com/150' }} 
          style={styles.image}
        />
      </Card>
      
      <View style={styles.infoContainer}>
        <Text>Temp: 37°</Text>
        <Text>Hum: 65%</Text>
        <Text>Último riego: 1 day</Text>
      </View>

      <Button icon="chart-line" mode="outlined" onPress={() => {}}>
        Estadísticas
      </Button>
      
      <View style={styles.switchContainer}>
        <Text>Automático</Text>
        <Switch value={isAutomatic} onValueChange={toggleSwitch} />
      </View>
      
      <Button mode="contained" onPress={() => {}}>
        Regar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  imageContainer: {
    width: 200,
    height: 150,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
});
