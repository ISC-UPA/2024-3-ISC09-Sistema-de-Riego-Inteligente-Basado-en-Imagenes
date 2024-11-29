import React, { useState, useContext, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { OrganizationContext } from '../context/OrganizationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CREATE_USER } from '@/api/queries/queryUsers';
import { UPDATE_USER } from '@/api/queries/queryUsers';
import { useMutation } from '@apollo/client';
import { Picker } from '@react-native-picker/picker';
import { Platform } from 'react-native';

const AddMemberScreen: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('Trabajador agrícola');
  const [accountStatus, setAccountStatus] = useState('inactive');
  const [telefono, setTelefono] = useState('');
  const [errors, setErrors] = useState({ nombre: '', email: '', telefono: '' });
  const [token, setToken] = useState<string | null>(null);
  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [ranchId, setRanchId] = useState<string | null>(null);
  const [storedUserId, setStoredUserId] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null); 


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

  const organizationContext = useContext(OrganizationContext)
  if (!organizationContext) {
    throw new Error('organization context debe ser utilizado dentro de un OrganizationProvider');
  }


  const { addMember, setAddMember, updateMember, setUpdateMember, selectedUserId, selectedUserPhone, 
    selectedUserRole, selectedUserName } = organizationContext;

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem('accessToken');
      const id = await AsyncStorage.getItem('userId');
      const storedUserRole = await AsyncStorage.getItem('userRole');
      //Si existe el token, agregarlo al estado local
      if (savedToken) {
        setToken(savedToken);
      }
      if (id) {
        setStoredUserId(id);  // Establecer el userId en el estado
      }
      if (storedUserRole) {
        setUserRole(storedUserRole); // Establecer el rol
      }
    }
    loadToken()
  }, [])

  useEffect(() => {
    if (updateMember) {
      setNombre(selectedUserName || '');
      setTelefono(selectedUserPhone || '');
      setRol(selectedUserRole || 'Trabajador agrícola');
    }
  }, [updateMember, selectedUserName, selectedUserPhone, selectedUserRole]);

 

  const handleBackPress = () => {
    setAddMember(false)
    setUpdateMember(false)
  };

  const validateInputs = () => {
    let valid = true;
    const newErrors = { nombre: '', email: '', telefono: '' };

    if (nombre.trim() === '') {
      newErrors.nombre = 'El nombre es obligatorio';
      valid = false;
    }

    if (!updateMember) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Correo inválido';
        valid = false;
      }
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(telefono)) {
      newErrors.telefono = 'El teléfono debe tener 10 dígitos';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };


  const inviteUserAzure = async (email: string) => {
    try {
      if (!token) {
        console.error('Token de acceso no disponible');
        return;
      }

      const response = await fetch('https://graph.microsoft.com/v1.0/invitations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitedUserEmailAddress: email,
          inviteRedirectUrl: 'http://localhost:8081/', // URL a la que el usuario será redirigido
          sendInvitationMessage: true,
          invitedUserMessageInfo: {
            customizedMessageBody: '¡Te invitamos a unirte a nuestra plataforma!',
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Usuario invitado exitosamente:', result);
        alert('Invitación enviada con éxito');
        return true
      } else {
        const error = await response.json();
        console.error('Error al invitar al usuario:', error);
        alert('Error al enviar la invitación');
        return true
      }
    } catch (error) {
      console.error('Error al invitar al usuario:', error);
      return false
    }
  };

  const handleSubmitCreate = async () => {
    if (validateInputs()) {
      setIsLoading(true)
      const invited = await inviteUserAzure(email)
      
      if (invited) {
        try {
          await createUser({
            variables: {
              data: {
                full_name: nombre,
                email: email,
                phone_number: telefono,
                ranch_id: { connect: { id: ranchId } },
                role: rol,
                accountStatus: accountStatus,
                crops: {
                  connect: [
                    {
                      id: "cm41yvt5d00024yg6h986dzh2"
                    }
                  ]
                }
              },
            },
          });
          alert('Usuario creado con éxito');
          setIsLoading(false)
          handleBackPress();
        } catch (error) {
          console.error('Error al crear usuario:', error);
          alert('Error al crear el usuario');
        }
      }

      handleBackPress();
    } else {
      // Alert.alert('Error', 'Por favor corrige los errores antes de continuar');
    }
  };

  const handleSubmitUpdate = async () => {
    
    if (validateInputs()) {
      console.log("update")
      try {
        await updateUser({
          variables: {
            where: {
              id: selectedUserId // Reemplaza "{id usuario}" con la variable o valor correspondiente
            },
            data: {
              full_name: nombre,
              phone_number: telefono,
              role: rol,
            },
          },
        });
        alert('Usuario actualizado con éxito');
        const storageUserId = await AsyncStorage.getItem('userId')
        if(storageUserId == selectedUserId){
          await AsyncStorage.setItem('userFullName', nombre);
          await AsyncStorage.setItem('userRole', rol);
          await AsyncStorage.setItem('userPhoneNumber', telefono);
        }
        handleBackPress();
      } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        alert('Error al actualizar el usuario');
      }


      handleBackPress();
    } else {
      // Alert.alert('Error', 'Por favor corrige los errores antes de continuar');
    }
  };

  let titleText = '';

  if (addMember) {
    titleText = 'Agregar Miembro';
  } else if (selectedUserId === storedUserId) {
    titleText = 'Actualizar Perfil';
  } else {
    titleText = 'Actualizar Miembro';
  }

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.titleText}>{titleText}</Text>
        <View style={styles.formContainer}>
          {/* Input de Nombre */}
          <TextInput
            label="Nombre"
            value={nombre}
            onChangeText={(text) => setNombre(text)}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: '#0284c7', outline: '#ffffff' } }}
            error={!!errors.nombre}
            disabled={isLoading}
          />
          {errors.nombre ? <Text style={styles.errorText}>{errors.nombre}</Text> : null}

          {!updateMember && (
            <TextInput
              label="Correo Electrónico"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: '#0284c7', outline: '#ffffff' } }}
              keyboardType="email-address"
              error={!!errors.email}
              disabled={isLoading}
            />
          )}
          {!updateMember && errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          {/* Input de Teléfono */}
          <TextInput
            label="Teléfono"
            value={telefono}
            onChangeText={(text) => setTelefono(text)}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: '#0284c7', outline: '#ffffff' } }}
            keyboardType="numeric"
            error={!!errors.telefono}
            disabled={isLoading}
          />
          {errors.telefono ? <Text style={styles.errorText}>{errors.telefono}</Text> : null}
          {userRole === 'Administrador' || userRole === 'Agrónomo' ? (
            <View style={styles.pickerWrapper}>
              <Text style={[styles.label, isFocused ? styles.labelFocused : styles.labelNotFocused]}>
                Rol
              </Text>

              <View style={[styles.pickerContainer, isFocused ? styles.pickerFocused : null]}>
                <Picker
                  selectedValue={rol}
                  onValueChange={(itemValue) => { 
                    setRol(itemValue); 
                    console.log(itemValue);
                  }}
                  onFocus={() => setIsFocused(true)} // Mantener el foco
                  onBlur={() => setIsFocused(false)} // Cambiar el estado de enfoque
                  style={styles.picker}
                  mode="dropdown"
                  enabled={!isLoading}
                >
                  <Picker.Item label="Trabajador agrícola" value="Trabajador agrícola" />
                  <Picker.Item label="Administrador" value="Administrador" />
                  <Picker.Item label="Agrónomo" value="Agrónomo" />
                  <Picker.Item label="Supervisor de Riego" value="Supervisor de Riego" />
                </Picker>
              </View>
            </View>): null}
          {/* Botones */}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              labelStyle={{ color: '#0284c7' }}
              onPress={handleBackPress}
              buttonColor="#bae6fd"
              style={styles.button}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={updateMember ? handleSubmitUpdate : handleSubmitCreate}
              buttonColor="#0284c7"
              style={styles.button}
              disabled={isLoading}
            >
              {updateMember ? 'Actualizar' : 'Crear'}
            </Button>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 16,
  },
  formContainer: {
    marginTop: 16,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0c4a6e',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  pickerWrapper: {
    marginVertical: 10,
    position: 'relative',
    width: '100%',  // Asegura que el contenedor tenga un ancho completo
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#0284c7', // Color principal (#0284c7)
    borderRadius: 4,
    height: 56, // Ajuste de altura
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: '100%',  // Asegura que el Picker ocupe todo el espacio disponible
  },
  pickerFocused: {
    borderColor: '#0284c7', // Color de borde cuando está enfocado
  },
  picker: {
    color: '#0284c7', // Color del texto en el picker
    height: '100%',
    width: '100%',  // Asegura que el Picker ocupe todo el espacio disponible en el contenedor
    fontFamily: 'sans-serif',
    fontSize: 16,
    ...Platform.select({
      android: {
        color: '#0284c7', // Color del texto en Android
      },
      ios: {
        height: '100%', // Ajuste de altura para iOS
      },
    }),
  },
  label: {
    position: 'absolute',
    top: 18,
    left: 5,
    fontSize: 16,
    color: '#6e6e6e', // Color gris claro de la etiqueta
    zIndex: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
  },
  labelNotFocused: {
    position: 'absolute',
    top: 18,
    left: 5,
    fontSize: 16,
    color: '#6e6e6e', // Color gris claro de la etiqueta
    zIndex: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    width: 300,  // Aplica el ancho cuando no está enfocado
  },
  labelFocused: {
    top: -8,
    left: 8,
    fontSize: 12,
    color: '#0284c7', // Color de la etiqueta cuando está enfocada
  },
});

export default AddMemberScreen;
