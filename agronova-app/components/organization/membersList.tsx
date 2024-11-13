import { StyleSheet, Image, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/widgets/ThemedText';

const members = [
  { name: 'Antonio Leon', role: 'Administrador' },
  { name: 'Francisco Baños', role: 'Peón' },
  { name: 'Pablo Balboa', role: 'Ingeniero Agrónomo' },
  { name: 'Carlos Ramirez', role: 'Contador' },
  { name: 'Maria Perez', role: 'Especialista en Ventas' },
  { name: 'Juan Castillo', role: 'Supervisor de Campo' },
];

export default function MembersList() {
  return (
    <View style={styles.membersContainer}>
      <ThemedText style={styles.membersTitle}>Miembros</ThemedText>
      <ScrollView style={styles.membersList} contentContainerStyle={styles.scrollContent}>
        {members.map((member, index) => (
          <View
            key={index}
            style={[styles.memberItem, { backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ececec' }]}
          >
            <Image
              source={{
                uri: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
              }}
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
  );
}

const styles = StyleSheet.create({
  membersContainer: {
    marginTop: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#f0f9ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  membersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 10,
    color: '#0c4a6e',
  },
  membersList: {
    maxHeight: 200,
    borderRadius: 8,
    marginBottom: 20
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
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'transparent',
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
    color: '#0c4a6e',
  },
  memberRole: {
    fontSize: 14,
    color: '#075985',
  },
});
