import { StyleSheet, Image, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/widgets/ThemedText';
import React, { useContext, useState } from 'react';
import { IconButton } from 'react-native-paper';
import { OrganizationContext } from '../context/OrganizationContext';
import DeleteConfirmationModal from '../widgets/ConfirmModal';
import { GET_RANCH_MEMBERS } from '@/api/queries/queryUsers';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_USER } from '@/api/queries/queryUsers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
// const members = [

//   { name: 'Antonio Leon', role: 'Administrador' },
//   { name: 'Francisco Baños', role: 'Peón' },
//   { name: 'Pablo Balboa', role: 'Ingeniero Agrónomo' },
//   { name: 'Carlos Ramirez', role: 'Contador' },
//   { name: 'Maria Perez', role: 'Especialista en Ventas' },
//   { name: 'Juan Castillo', role: 'Supervisor de Campo' },
// ];

export default function MembersList() {

  const organizationContext = useContext(OrganizationContext);

  if (!organizationContext) {
    throw new Error('organization context debe ser utilizado dentro de un OrganizationProvider');
  }

  const {setAddMember, setUpdateMember, setViewMember, setSelectedUserId, selectedUserName, setUserEmail, 
          setSelectedUserName, setSelectedUserPhone, setSelectedUserRole, selectedUserId} = organizationContext;
  const [isModalVisible, setModalVisible] = useState(false);
  const [deleteUser] = useMutation(DELETE_USER);
  const [ranchId, setRanchId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRanchId = async () => {
      try {
        const storedRanchId = await AsyncStorage.getItem('ranchId');
        setRanchId(storedRanchId);
      } catch (error) {
        console.error('Error al obtener el ranchId del AsyncStorage:', error);
      }
    };

    fetchRanchId();
  }, []);

  const { data, loading, error, refetch } = useQuery(GET_RANCH_MEMBERS, {
    variables: { 
      where: { 
        id: ranchId
      },
      userWhere2: {
        accountStatus: {
          not: {
            equals: "suspended"
          }
        }
      }
    },
    fetchPolicy: 'cache-and-network',
  });

  const handleConfirmDelete =  async (name: string | null) => {
    try {
      await deleteUser({
        variables: {
          where: {
            id: selectedUserId
          },
          data: {
            accountStatus: "suspended"
          },
        },
      });
      alert('Usuario eliminado con éxito');
      refetch()
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      alert('Error al eliminar el usuario');
    }
    console.log('Usuario eliminado:', name);
    setModalVisible(false); // Cerrar el modal después de confirmar la eliminación
  };


  const handleAddUser = () => {
    setAddMember(true)
  }
  const handleViewUser = (userId : any, name : any, phone : any, role : any, email: any) => {
    setViewMember(true)
    setSelectedUserId(userId);
    setSelectedUserName(name);
    setSelectedUserPhone(phone);
    setSelectedUserRole(role);
    setUserEmail(email);
  }
  const handleUpdateUser = (userId : any, name : any, phone : any, role : any) => {
    setUpdateMember(true)
    setSelectedUserId(userId);
    setSelectedUserName(name);
    setSelectedUserPhone(phone);
    setSelectedUserRole(role);
  }
  const handleDeleteUser = (userId : any, name : any) => {
    setModalVisible(true);
    setSelectedUserId(userId);
    setSelectedUserName(name);
  }

  const members = data?.ranch?.user || [];

  return (
    <View style={styles.membersContainer}>
      <View style={styles.header}>
        <ThemedText style={styles.membersTitle}>Miembros</ThemedText>
        <View style={styles.addButtonContainer}>
          <IconButton
            icon="plus"
            onPress={handleAddUser}
            iconColor={'#ffffff'}
            size={20}
            style={styles.addButton}
          />
        </View>
      </View>
      <ScrollView style={styles.membersList} contentContainerStyle={styles.scrollContent}>
        {members.map((member : any, index: any) => (
          <View
            key={member.id}
            style={[styles.memberItem, { backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ececec' }]}
          >
            <Image
              source={{
                uri: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
              }}
              style={styles.memberImage}
            />
            <View style={styles.memberInfo}>
              <ThemedText style={styles.memberName}>{member.full_name}</ThemedText>
              <ThemedText style={styles.memberRole}>{member.role}</ThemedText>
            </View>
            <View style={styles.iconContainer}>
              <IconButton
                icon="eye"
                onPress={() => handleViewUser(member.id,member.full_name, member.phone_number, member.role, member.email)}
                iconColor={'#4b5563'}
                style={styles.iconButton}
                size={18}
              />
              <IconButton
                icon="pencil"
                onPress={() => handleUpdateUser(member.id,member.full_name, member.phone_number, member.role)}
                iconColor={'#4b5563'}
                style={styles.iconButton}
                size={18}
              />
              <IconButton
                icon="trash-can"
                onPress={() => handleDeleteUser(member.id,member.full_name)}
                iconColor={'#4b5563'}
                style={styles.iconButton}
                size={18}
              />
              
            </View>
          </View>
        ))}
      </ScrollView>
      <DeleteConfirmationModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onConfirmDelete={() => handleConfirmDelete(selectedUserName)}  
                itemName={selectedUserName}            
      />
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
