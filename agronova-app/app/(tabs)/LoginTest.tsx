import { useEffect, useState, useReducer } from 'react';
import * as WebBrowser from 'expo-web-browser';
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
import { Button, Text, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet } from 'react-native';

//Abre una ventana del navegador para la autentificación
WebBrowser.maybeCompleteAuthSession();

export default function App() {
  

  // Endpoint
  const discovery = useAutoDiscovery(
    'https://login.microsoftonline.com/f03c71fb-da10-4831-93b3-79b594a2ec2a/v2.0',
  );
  const tokenEndpoint = 'https://login.microsoftonline.com/f03c71fb-da10-4831-93b3-79b594a2ec2a/oauth2/v2.0/token'
  //Url para el redireccionamiento, se debe de cambiar en producción
  const redirectUri = makeRedirectUri({
    scheme: 'myapp',
    path: '',
  });
  //ClientId del app registration, se debe cambiar la manera de acceder a este id a una manera más segura
  const clientId = '1ef5f9af-f519-4991-bbd9-cd99ea55c4a8';

  // Almacenar el token de acceso 
  const [token, setToken] = useState<string | null>(null);


  // Request 
  const [request, , promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      redirectUri,
    },
    discovery,
  );


  // Verificar si ya existe un token en AsyncStorage al iniciar la aplicación
  useEffect(() => {
    //Función para obtener el token de AsyncStorage
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem('accessToken');
      //Si existe el token, agregarlo al estado local
      if (savedToken) {
        setToken(savedToken);
        await handleRefresh();
      }
    };
    //Llamada a la función para revisar si se necesita actualizar el token
    
    loadToken();

  }, []);

  // Manejar el inicio de sesión
  const handleSignIn = () => {
    //Función que abre la ventana de autentificación
    promptAsync().then((codeResponse) => {
      if (request && codeResponse?.type === 'success' && discovery) {
        exchangeCodeAsync(
          {
            clientId,
            code: codeResponse.params.code,
            extraParams: request.codeVerifier
              ? { code_verifier: request.codeVerifier }
              : undefined,
            redirectUri,
          },
          discovery,
        ).then(async (res) => {
          setToken(res.accessToken);

          // Guardar el accessToken en AsyncStorage
          try {
            await AsyncStorage.setItem('accessToken', res.accessToken);
            await AsyncStorage.setItem('refreshToken', res.refreshToken ?? '');
            await AsyncStorage.setItem('expiresIn', res.expiresIn?.toString() || '');
            await AsyncStorage.setItem('issuedAt', res.issuedAt.toString());
            console.log('Access token guardado correctamente');
          } catch (error) {
            console.error('Error al guardar access token en AsyncStorage', error);
          }
        });
      }
    });
  };

  // Manejar el cierre de sesión
  const handleSignOut = async () => {
    
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('expiresIn');
      await AsyncStorage.removeItem('issuedAt');
      setToken(null);
      console.log('Sesión cerrada y token eliminado');
    } catch (error) {
      console.error('Error al eliminar el access token de AsyncStorage', error);
    }
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <Button
        disabled={!request && !discovery}
        title={token ? "Sign Out" : "Sign In"}
        onPress={token ? handleSignOut : handleSignIn}
      />
      <Text>{token ? 'Sesión iniciada' : 'Por favor, inicia sesión'}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
})