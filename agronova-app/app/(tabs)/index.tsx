import { ThemedText } from '@/components/atoms/ThemedText';
import { ThemedView } from '@/components/atoms/ThemedView';
import { ScrollView } from 'react-native';
import { Card, IconButton, FAB } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      {/* Título principal */}
      <ThemedText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Rancho "Las Camelinas"
      </ThemedText>

      {/* Floating Action Button para agregar nuevo cultivo */}
      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
        }}
        onPress={() => {}}
      />

      {/* Lista de Cultivos */}
      <ScrollView style={{marginVertical: 25}}>
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <ThemedText>Cultivo A</ThemedText>
          </Card.Content>
          <Card.Actions>
            <IconButton icon="pencil" onPress={() => {}} />
            <IconButton icon="delete" onPress={() => {}} />
          </Card.Actions>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <ThemedText>Cultivo B</ThemedText>
          </Card.Content>
          <Card.Actions>
            <IconButton icon="pencil" onPress={() => {}} />
            <IconButton icon="delete" onPress={() => {}} />
          </Card.Actions>
        </Card>
      </ScrollView>
    </ThemedView>
  );
}
