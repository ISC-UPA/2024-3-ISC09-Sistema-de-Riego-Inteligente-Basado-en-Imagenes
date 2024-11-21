import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback, Animated, Text, TouchableOpacity, Image } from 'react-native';
import { Drawer } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrganizationContext } from '@/components/context/OrganizationContext';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleItemPress = (item: string) => {
    setSelectedOption(item); // Actualiza el estado con la opción seleccionada
    onClose(); // Cierra el menú cuando se selecciona una opción
  };

  const handleLogoutPress = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('expiresIn');
      await AsyncStorage.removeItem('issuedAt');
      navigation.navigate('');
      console.log('Sesión cerrada y token eliminado');
    } catch (error) {
      console.error('Error al eliminar el access token de AsyncStorage', error);
    }
    onClose(); // Cierra el menú después de cerrar sesión
  };

  const organizationContext = useContext(OrganizationContext);  // Obtenemos el contexto completo

  if (!organizationContext) {
    return null;  // Si el contexto es undefined, no renderizamos el componente
  }

  const { setHelp } = organizationContext;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: slideAnim }] }]}>
              <LinearGradient
                colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']}
                style={styles.gradientBackground}
              >
                <Drawer.Section>
                  <TouchableOpacity
                    onPress={() => handleItemPress('usuario')} // Pasa la opción "usuario"
                    style={[
                      styles.drawerItem,
                      selectedOption === 'usuario' && styles.selectedItem, // Cambia el estilo si es la opción seleccionada
                    ]}
                  >
                    <Image
                      source={{
                        uri: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
                      }}
                      style={styles.icon}
                    />
                    <Text style={styles.itemText}>Usuario</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setHelp(true);
                      onClose();
                    }} // Cierra el drawer después de abrir la ayuda
                    style={[
                      styles.drawerItem,
                      selectedOption === 'ayuda' && styles.selectedItem, // Cambia el estilo si es la opción seleccionada
                    ]}
                  >
                    <MaterialIcons name="settings" size={24} color="#65a30d" />
                    <Text style={styles.itemText}>Ayuda y Soporte</Text>
                  </TouchableOpacity>
                </Drawer.Section>

                <View style={styles.spacer} />

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
                  <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  drawerContainer: {
    width: '60%',
    height: '100%',
    borderTopLeftRadius: 30,  // Mayor radio de las esquinas
    borderBottomLeftRadius: 30,  // Mayor radio de las esquinas
    overflow: 'hidden',
  },
  gradientBackground: {
    flex: 1,
    padding: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#0c4a6e',
    paddingVertical: 2,
    paddingLeft: 10,
    fontWeight: 'bold',
  },
  icon: {
    width: 30,  // Tamaño de la imagen
    height: 30,
    borderRadius: 15,  // Hacemos la imagen circular
    marginRight: 15,  // Mayor separación entre la imagen y el texto
    alignSelf: 'center', // Centra la imagen verticalmente
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center', // Alineamos verticalmente el texto con la imagen
    justifyContent: 'flex-start', // Aseguramos que el contenido esté alineado a la izquierda
    paddingVertical: 5,  // Añadimos más espacio arriba y abajo
    borderRadius: 10,  // Añadimos borde redondeado a los ítems
    paddingHorizontal:10 //Separa los iconos del borde del contenedor sombreado
  },
  selectedItem: {
    backgroundColor: '#dbeafe', // Color de fondo cuando está seleccionado
    borderRadius: 20, // Redondeamos las esquinas del item
  },
  spacer: {
    flexGrow: 1,
  },
  logoutButton: {
    backgroundColor: '#0369a1',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SideMenu;
