import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button, Switch, Card, IconButton } from 'react-native-paper';
import { ThemedView } from '@/components/widgets/ThemedView';

export default function CultivoScreen() {
  const [isAutomatic, setIsAutomatic] = useState(false);

  const toggleSwitch = () => setIsAutomatic(!isAutomatic);

  return (
    <LinearGradient
    colors={['#f0f9ff', '#e0f2fe', '#bae6fd','#7dd3fc']} 
    style={{ flex: 1 }}
    >
      <ThemedView 
        style={{ flex: 1, padding: 16 }}
        lightColor="transparent"
        darkColor="transparent">
        <View>
          <Text style={styles.title}>Cultivo X</Text>
        </View>
        <View>
          <View style={styles.descriptionContainer}>
            <View style={styles.locationContainer}>
              <IconButton icon="map-marker" size={20} />
              <Text style={styles.locationText}>Ags, Ags</Text>
            </View>
            <View style={styles.switchContainer}>
                <Text style={styles.text}>Automático</Text>
                <Switch
                  value={isAutomatic}
                  onValueChange={toggleSwitch}
                  color="#65a30d"
                  thumbColor="#d1d5db"
                />
            </View>
          </View>
        </View>
        <View>
          <Card style={styles.imageContainer}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/150' }} 
              style={styles.image}
            />
          </Card>
        </View>
        <View>
          <View style={styles.stadisticsContainer}>
            <Button 
              icon="coolant-temperature" 
              mode="contained"
              buttonColor="#e0f2fe"
              labelStyle={{ color: "#0ea5e9" }}
              style={{ margin: 0 }}
              onPress={() => {}}>
              37°
            </Button>
            <Button 
              icon="air-humidifier" 
              mode="contained"
              buttonColor="#e0f2fe"
              labelStyle={{ color: "#0ea5e9" }}
              style={{ margin: 0 }}
              onPress={() => {}}>
              65%
            </Button>
            <Button 
              icon="water-pump" 
              mode="contained"
              buttonColor="#e0f2fe"
              labelStyle={{ color: "#0ea5e9" }}
              style={{ margin: 0 }}
              onPress={() => {}}>
              80%
            </Button>
          </View>
        </View>
        <View>
          <Button 
            icon="chart-line" 
            buttonColor={'#bae6fd'} 
            labelStyle={{ color: "#f0f9ff", }}
            onPress={() => {}}>
            Estadísticas
          </Button>
        </View>
      </ThemedView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,   
    alignItems: 'center',  
  },
  descriptionContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',  
    alignItems: 'center',  
  },
  imageContainer: {
    height: 250,
    marginVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stadisticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    width: '100%',  
  },
  locationText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 4, // Espacio entre el ícono y el texto
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#0c4a6e',
    fontWeight: 'bold',
  },
  text: {
    color: '#374151',  
    fontWeight: '600', 
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
