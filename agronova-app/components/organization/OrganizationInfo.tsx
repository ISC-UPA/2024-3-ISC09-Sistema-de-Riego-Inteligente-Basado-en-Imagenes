import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/widgets/ThemedText';
import { ThemedView } from '@/components/widgets/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import MembersList from './membersList'; // Asegúrate de importar el componente correctamente

export default function Organization() {
  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']}
      style={{ flex: 1 }}
    >
      <ThemedView style={{ flex: 1, padding: 16 }} lightColor="transparent" darkColor="transparent">
        <View>
          <ThemedText style={styles.titleText}>Rancho "Las Camelinas"</ThemedText>
          <ThemedText style={styles.descriptionText}>
            Empresa líder en producción de maíz a nivel nacional, con más de 30 años de experiencia en el sector.
          </ThemedText>
          {/* Aquí llamas al componente MembersList */}
          <MembersList />
        </View>
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
  descriptionText: {
    textAlign: 'justify',
    fontSize: 16,
    marginVertical: 10,
    color: '#0c4a6e',
  },
});
