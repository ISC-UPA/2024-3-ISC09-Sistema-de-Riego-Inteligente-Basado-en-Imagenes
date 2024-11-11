import AddButton from '@/components/widgets/AddButton';
import CropCard from '@/components/crops/CropCard'
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/widgets/ThemedText';
import { ThemedView } from '@/components/widgets/ThemedView';
import { ScrollView } from 'react-native';

export default function CropList() {
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
        <ThemedText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
          Rancho "Las Camelinas"
        </ThemedText>

        {/* Button to add new crop */}
        <AddButton></AddButton>
        
        {/* Crops list */}
        <ScrollView style={{ marginVertical: 25 }}>
          <CropCard></CropCard>
        </ScrollView>
      </ThemedView>
    </LinearGradient>
  );
}
