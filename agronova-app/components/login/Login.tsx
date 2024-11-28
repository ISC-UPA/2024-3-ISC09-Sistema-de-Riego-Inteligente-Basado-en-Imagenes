import { Stack } from 'expo-router';
import { useEffect, useState, useContext } from 'react';
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
  TokenResponse,
  TokenResponseConfig,
  RefreshTokenRequestConfig,
  DiscoveryDocument
} from 'expo-auth-session';
import { Text, SafeAreaView, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'react-native-paper';
import { jwtDecode } from 'jwt-decode';
import { useLazyQuery } from '@apollo/client';
import { GET_USER } from '@/api/queries/queryUsers';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { OrganizationContext } from '@/components/context/OrganizationContext';  // Importa tu contexto

// Completar la sesión de autenticación en el navegador
WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const navigation = useNavigation();
  
  // Acceder al contexto
  const { setUserId, setUserFullName, setUserEmail} = useContext(OrganizationContext);

  const discovery = useAutoDiscovery(
    'https://login.microsoftonline.com/f03c71fb-da10-4831-93b3-79b594a2ec2a/v2.0',
  );
  const tokenEndpoint = 'https://login.microsoftonline.com/f03c71fb-da10-4831-93b3-79b594a2ec2a/oauth2/v2.0/token';
  
  const redirectUri = makeRedirectUri({
    scheme: 'myapp',
    path: '',
  });
  
  const clientId = '1ef5f9af-f519-4991-bbd9-cd99ea55c4a8';

  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [fetchUser, { data }] = useLazyQuery(GET_USER);

  const [request, , promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ['openid', 'profile', 'email', 'offline_access','https://graph.microsoft.com/User.Invite.All'],
      redirectUri,
    },
    discovery,
  );

  useEffect(() => {
    if (email) {
      fetchUser({ variables: { where: { email } } });
    }
  }, [email]);

  useEffect(() => {
    if (data && data.user) {
      console.log('Datos del usuario:', data.user);
      // Guardar datos en el contexto
      setUserId(data.user.id);
      setUserFullName(data.user.full_name);
      setUserEmail(data.user.email);

      if (data.user.accountStatus === 'inactive' && data.user.role === 'administrator') {
        navigation.navigate('create-ranch');
      } else {
        navigation.navigate('(tabs)');
      }
    }
  }, [data]);

  useEffect(() => {
    if (data && data.user) {
      console.log('Datos del usuario:', data.user);
      
      // Guardar datos en el contexto
      setUserId(data.user.id);
      setUserFullName(data.user.full_name);
      setUserEmail(data.user.email);
  
      // Almacenar los datos del usuario en AsyncStorage
      const storeUserData = async () => {
        try {
          await AsyncStorage.setItem('userId', data.user.id);
          await AsyncStorage.setItem('userFullName', data.user.full_name);
          await AsyncStorage.setItem('userEmail', data.user.email);
          await AsyncStorage.setItem('userRole', data.user.role);
          if (data.user.ranch_id) {
            await AsyncStorage.setItem('ranchId', data.user.ranch_id.id);
          }
          console.log('Datos del usuario guardados en AsyncStorage');
        } catch (error) {
          console.error('Error al guardar datos del usuario en AsyncStorage', error);
        }
      };
  
      storeUserData();
  
      // Lógica de navegación
      if (data.user.accountStatus === 'inactive' && data.user.role === 'administrator') {
        navigation.navigate('create-ranch');
      } else {
        navigation.navigate('(tabs)');
      }
    }
  }, [data]);
  

  // Verificar si ya existe un token en AsyncStorage al iniciar la aplicación
  useEffect(() => {
    //Función para obtener el token de AsyncStorage
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem('accessToken');
      //Si existe el token, agregarlo al estado local
      if (savedToken) {
        setToken(savedToken);
        await handleRefresh();
        navigation.navigate('(tabs)')
      }
    };
    //Llamada a la función para revisar si se necesita actualizar el token
    
    loadToken();

  }, []);

  const handleRefresh = async () => {
    try {
      // Obtener datos de AsyncStorage
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const expiresIn = await AsyncStorage.getItem('expiresIn');
      const issuedAt = await AsyncStorage.getItem('issuedAt');

      // Crear TokenResponseConfig con los datos de AsyncStorage
      if (accessToken && refreshToken && expiresIn && issuedAt) {
        const tokenConfig: TokenResponseConfig = {
          accessToken: accessToken,
          expiresIn: Number(expiresIn),
          refreshToken: refreshToken,
          issuedAt: Number(issuedAt),
        };
        
        const tokenResponse = new TokenResponse(tokenConfig);

        //La función shouldRefresh verifica si el token necesita actualizarse
        
        if (tokenResponse.shouldRefresh()) {
          console.log('El token necesita ser refrescado');

          //Crear configuración para actualizar el token
          const refreshConfig: RefreshTokenRequestConfig = { clientId: clientId,refreshToken: tokenConfig.refreshToken }

          //Crear el endpoint del token
          const endpointConfig: Pick<DiscoveryDocument, "tokenEndpoint"> = { tokenEndpoint }

          //Intentar refrescar el token de acceso usando refreshAsync
          
          const newTokenResponse = await tokenResponse.refreshAsync(refreshConfig, endpointConfig);

          if (newTokenResponse) {
            setToken(newTokenResponse.accessToken);

            // Actualizar valores en AsyncStorage
            await AsyncStorage.setItem('accessToken', newTokenResponse.accessToken);
            await AsyncStorage.setItem('refreshToken', newTokenResponse.refreshToken ?? '');
            await AsyncStorage.setItem('expiresIn', newTokenResponse.expiresIn?.toString() ?? '');
            await AsyncStorage.setItem('issuedAt', newTokenResponse.issuedAt.toString());

            console.log('Token refrescado y guardado correctamente');
          }
        } else {
          console.log('El token es válido y no necesita refresco');
        }
      } else {
        console.log('No se encontraron todos los datos necesarios en AsyncStorage');
      }
    } catch (error) {
      console.error('Error al manejar el refresh del token:', error);
      await handleSignOut()
    }
  }

  const handleSignIn = async () => {
    const result = await promptAsync();
    if (request && result?.type === 'success' && discovery) {
      const code = await exchangeCodeAsync(
        {
          clientId,
          code: result.params.code,
          extraParams: request.codeVerifier ? { code_verifier: request.codeVerifier } : undefined,
          redirectUri,
        },
        discovery,
      );

      setToken(code.accessToken);
      if (code.idToken) {
        const decodedToken: any = jwtDecode(code.idToken);
        const emailAzure: any = decodedToken.email;
        console.log(emailAzure);
        setEmail(emailAzure);

        // Guardar el email en el contexto
        setUserEmail(emailAzure);
      }

      try {
        await AsyncStorage.setItem('accessToken', code.accessToken);
        await AsyncStorage.setItem('refreshToken', code.refreshToken ?? '');
        await AsyncStorage.setItem('expiresIn', code.expiresIn?.toString() || '');
        await AsyncStorage.setItem('issuedAt', code.issuedAt.toString());
        console.log('Access token guardado correctamente');
      } catch (error) {
        console.error('Error al guardar access token en AsyncStorage', error);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('expiresIn');
      await AsyncStorage.removeItem('issuedAt');
      setToken(null);
      console.log('Sesión cerrada y token eliminado');
      // Limpiar datos del contexto
      setUserId(null);
      setUserFullName(null);
      setUserEmail(null);
    } catch (error) {
      console.error('Error al eliminar el access token de AsyncStorage', error);
    }
  };

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc']}
      style={{ flex: 1 }}
    >
      <Stack.Screen options={{ title: '', headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <Image source={require('@/assets/images/logo.png')} style={{ width: 100, height: 100 }} />
        <Image source={require('@/assets/images/agronova.png')} style={{ width: 320, height: 100 }} />
        <Text style={styles.descriptionText}>
          {token ? 'Sesión iniciada' : 'Por favor, inicia sesión'}
        </Text>

        {
          !token ? <Button
          disabled={!request && !discovery}
          icon="microsoft"
          buttonColor={'#1e40af'}
          labelStyle={{ color: '#f0f9ff' }}
          onPress={token ? handleSignOut : handleSignIn}
        >
          {token ? 'Sign Out' : 'Iniciar sesión'}
        </Button>
          : <></>
        }
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  descriptionText: {
    textAlign: 'justify',
    fontSize: 16,
    marginVertical: 10,
    color: '#0c4a6e',
    fontWeight: 'semibold',
  },
});
