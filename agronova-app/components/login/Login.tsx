import { Stack } from 'expo-router';
import { useEffect, useState, useContext } from 'react';
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
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
  const { setUserId, setUserFullName, setUserEmail } = useContext(OrganizationContext);

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
      scopes: ['openid', 'profile', 'email', 'offline_access'],
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
    }
  }, [data]);

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
        navigation.navigate('(tabs)');
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
        <Button
          disabled={!request && !discovery}
          icon="microsoft"
          buttonColor={'#1e40af'}
          labelStyle={{ color: '#f0f9ff' }}
          onPress={token ? handleSignOut : handleSignIn}
        >
          {token ? 'Sign Out' : 'Iniciar sesión'}
        </Button>
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
