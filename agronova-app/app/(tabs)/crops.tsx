import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, View, ScrollView } from 'react-native';

import ParallaxScrollView from '@/components/atoms/ParallaxScrollView';
import { ThemedText } from '@/components/atoms/ThemedText';
import { ThemedView } from '@/components/atoms/ThemedView';

const members = [
  { name: 'Antonio Leon', role: 'Administrador' },
  { name: 'Francisco Baños', role: 'Peón' },
  { name: 'Pablo Balboa', role: 'Ingeniero Agrónomo' },
  { name: 'Carlos Ramirez', role: 'Contador' },
  { name: 'Maria Perez', role: 'Especialista en Ventas' },
  { name: 'Juan Castillo', role: 'Supervisor de Campo' },
];

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.titleText}>Rancho "Las Camelinas"</ThemedText>
      </ThemedView>
      <ThemedText style={styles.descriptionText}>
        Empresa líder en producción de maíz a nivel nacional, con más de 30 años de experiencia en el sector.
      </ThemedText>

      <View style={styles.membersContainer}>
        <ThemedText style={styles.membersTitle}>Miembros</ThemedText>

        <ScrollView style={styles.membersList} contentContainerStyle={styles.scrollContent}>
          {members.map((member, index) => (
            <View key={index} style={[styles.memberItem, { backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ececec' }]}>
              <Image
                source={{ uri: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg' }}
                style={styles.memberImage}
              />
              <View style={styles.memberInfo}>
                <ThemedText style={styles.memberName}>{member.name}</ThemedText>
                <ThemedText style={styles.memberRole}>{member.role}</ThemedText>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descriptionText: {
    textAlign: 'justify',
    fontSize: 16,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  membersContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  membersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  membersList: {
    maxHeight: 200,
  },
  scrollContent: {
    paddingBottom: 5,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  memberImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  memberInfo: {
    flex: 1,
    paddingHorizontal: 10,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
  },
});
