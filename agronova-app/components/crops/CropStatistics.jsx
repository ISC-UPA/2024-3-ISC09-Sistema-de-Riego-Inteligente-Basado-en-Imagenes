import React, { useContext } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { ThemedView } from '@/components/widgets/ThemedView';
import { CropContext } from '@/components/context/CropContext';
import { CropChart} from '@/components/crops/CropChart';

export default function CropStatisticsScreen() {
  const cropContext = useContext(CropContext);

  // Verifica que cropContext no sea undefined
  if (!cropContext) {
    throw new Error('CropContext debe estar dentro del proveedor CropProvider');
  }

  const { setStatistics } = cropContext; // Obtenemos setRecord del contexto

  // Función para solo modificar `record`
  const handleBackPress = () => {
    setStatistics(false); // Cambiamos `record` a false sin afectar el selectedCropId
  };

  const [isAutomatic, setIsAutomatic] = useState(false);
  const toggleSwitch = () => setIsAutomatic(!isAutomatic);


  const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'];
  const dataValues = [500, 700, 800, 450, 600];
  const label = 'Producción';

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd','#7dd3fc']} 
      style={{ flex: 1 }}
    >
      <View style={styles.headerContainer}>
        <IconButton
          icon="chevron-left"
          size={24}
          onPress={handleBackPress} // Llamamos a handleBackPress cuando se presiona la flecha
        />
        <Text style={styles.titleText}>Estadística del cultivo X</Text>
      </View>
      <ThemedView 
        style={{ flex: 1, padding: 16 }}
        lightColor="transparent"
        darkColor="transparent"
      >

        <CropChart label={label} labels={labels} dataValues={dataValues}/>
        
      </ThemedView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0c4a6e',
  },
});
