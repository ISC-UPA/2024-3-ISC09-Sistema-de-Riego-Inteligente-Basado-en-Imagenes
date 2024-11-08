import { StyleSheet, Image, View, ScrollView } from 'react-native';

import ParallaxScrollView from '@/components/widgets/ParallaxScrollView';
import { ThemedText } from '@/components/widgets/ThemedText';
import { ThemedView } from '@/components/widgets/ThemedView';

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
            <View key={index} style={[styles.memberItem, { backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#e0e0e0' }]}>
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
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  descriptionText: {
    textAlign: 'justify',
    fontSize: 16,
    marginVertical: 5,
  },
  membersContainer: {
    marginTop: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  membersTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  membersList: {
    maxHeight: 184,
    borderRadius: 10,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
  },
  memberImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
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
  
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
