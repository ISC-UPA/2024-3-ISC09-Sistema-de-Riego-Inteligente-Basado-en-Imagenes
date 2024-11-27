import React, { useState, useContext, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { OrganizationContext } from '../context/OrganizationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CREATE_USER } from '@/api/queries/queryUsers';
import { useMutation } from '@apollo/client';
import { Picker } from '@react-native-picker/picker';

const AddMemberScreen: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('Trabajador agrícola');
  const [accountStatus, setAccountStatus] = useState('active');
  const [telefono, setTelefono] = useState('');
  const [errors, setErrors] = useState({ nombre: '', email: '', telefono: '' });
  const [token, setToken] = useState<string | null>(null);
  const [createUser] =useMutation(CREATE_USER);

  const organizationContext = useContext(OrganizationContext)

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem('accessToken');
      //Si existe el token, agregarlo al estado local
      if (savedToken) {
        setToken(savedToken);
      }
    }
    loadToken()
  },[])

  if (!organizationContext) {
    throw new Error('organization context debe ser utilizado dentro de un OrganizationProvider');
  }


  const { addMember,setAddMember, updateMember, setUpdateMember, ranchId} = organizationContext;

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Correo inválido';
      valid = false;
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

  const handleSubmit = async () => {
    if (validateInputs()) {
      const invited = await inviteUserAzure(email)
      if (invited){
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
              },
            },
          });
          alert('Usuario creado con éxito');
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

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.titleText}>{addMember ? 'Agregar Miembro' : 'Actualizar Miembro'}</Text>

          {/* Input de Nombre */}
          <TextInput
            label="Nombre"
            value={nombre}
            onChangeText={(text) => setNombre(text)}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: '#0284c7', outline: '#ffffff' } }}
            error={!!errors.nombre}
          />
          {errors.nombre ? <Text style={styles.errorText}>{errors.nombre}</Text> : null}

          {/* Input de Correo */}
          <TextInput
            label="Correo Electrónico"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: '#0284c7', outline: '#ffffff' } }}
            keyboardType="email-address"
            error={!!errors.email}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

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
          />
          {errors.telefono ? <Text style={styles.errorText}>{errors.telefono}</Text> : null}

          <View style={styles.pickerContainer}>
          <Picker
            selectedValue={rol}
            onValueChange={(itemValue) => {setRol(itemValue); console.log(itemValue)}}
            style={styles.picker}
          >
            <Picker.Item label="Trabajador agrícola" value="Trabajador agrícola" />
            <Picker.Item label="Administrador" value="Administrador" />
            <Picker.Item label="Agronomo" value="Agronomo" />
            <Picker.Item label="Supervisor de Riego" value="Supervisor de Riego" />
          </Picker>
        </View>

          {/* Botones */}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              labelStyle={{ color: '#0284c7' }}
              onPress={handleBackPress}
              buttonColor="#bae6fd"
              style={styles.button}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              buttonColor="#0284c7"
              style={styles.button}
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
  picker: {
    marginVertical: 8,
    height: 50,
    width: '100%',
    borderWidth: 0
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#0284c7',
    borderRadius: 5,
    marginBottom: 16,
    padding: 1,
    backgroundColor: '#fff',
  },
});

export default AddMemberScreen;
