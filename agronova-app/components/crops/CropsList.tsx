import *  as React from 'react';
import AddButton from '@/components/widgets/AddButton';
import CropCard from '@/components/crops/CropCard'
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/widgets/ThemedText';
import { ThemedView } from '@/components/widgets/ThemedView';
import { StyleSheet, ScrollView } from 'react-native';

export default function CropList() {
  const crops = [
    { id: 1, name: 'Cultivo 1' },
    { id: 2, name: 'Cultivo 2' },
  ];

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd','#7dd3fc']} 
      style={{ flex: 1 }}
    >
      <ThemedView style={{ flex: 1, padding: 16 }}
        lightColor="transparent"
        darkColor="transparent"
      >
        {/* Ranch name */}
        <ThemedText  style={styles.titleText}>
          Rancho "Las Camelinas"
        </ThemedText>

        {/* Button to add new crop */}
        <AddButton></AddButton>
        
        {/* Crops list */}
        <ScrollView style={{ marginVertical: 25 }}>
          {crops.map(crop => <CropCard key={crop.id} {...crop}/>)}
        </ScrollView>
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
});