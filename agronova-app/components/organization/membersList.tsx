import { StyleSheet, Image, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/widgets/ThemedText';
import React from 'react';
import { IconButton } from 'react-native-paper';

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
      <View style={styles.header}>
        <ThemedText style={styles.membersTitle}>Miembros</ThemedText>
        <View style={styles.addButtonContainer}>
          <IconButton
            icon="plus"
            onPress={() => console.log('Agregar miembro')}
            iconColor={'#ffffff'}
            size={20}
            style={styles.addButton}
          />
        </View>
      </View>
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
            <View style={styles.iconContainer}>
              <IconButton
                icon="eye"
                onPress={() => console.log('Ver miembro')}
                iconColor={'#4b5563'}
                style={styles.iconButton}
                size={18}
              />
              <IconButton
                icon="pencil"
                onPress={() => console.log('Editar miembro')}
                iconColor={'#4b5563'}
                style={styles.iconButton}
                size={18}
              />
              <IconButton
                icon="trash-can"
                onPress={() => console.log('Borrar miembro')}
                iconColor={'#4b5563'}
                style={styles.iconButton}
                size={18}
              />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  membersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0c4a6e',
  },
  addButtonContainer: {
    backgroundColor: '#7dd3fc',
    borderRadius: 20,
  },
  addButton: {
    margin: 0,
  },
  membersList: {
    maxHeight: 200,
    borderRadius: 8,
    marginBottom: 20,
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
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 'auto', // Esto empuja el contenedor de íconos al final (derecha)
  },
  iconButton: {
    marginHorizontal: -5, // Reducir margen horizontal para compactar los íconos
    paddingHorizontal: 0, // Eliminar el relleno horizontal para hacer los íconos más compactos
    paddingVertical: 0, // Eliminar el relleno vertical para hacer los íconos más compactos
  },
});
