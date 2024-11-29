import React, { useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import Organization from '@/components/organization/OrganizationInfo';
import AddMemberScreen from '@/components/organization/addMember';
import MemberProfile from '@/components/organization/MemberProfile';
import CreateRanch from '../create-ranch';
import { OrganizationContext } from '@/components/context/OrganizationContext';
import ExpiredSessionModal from '@/components/widgets/ExpiredSession';
import LoadingModal from '@/components/widgets/LoadingModal';

export default function OrganizationScreen() {
  // const navigation = useNavigation(); // Asegura que el objeto de navegación esté disponible
  const [isTokenVerified, setIsTokenVerified] = useState(false); // Estado del token
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [showSessionExpired, setShowSessionExpired] = useState(false); // Modal de sesión expirada

  useEffect(() => {
    const loadToken = async () => {
      try {
        setIsLoading(true); // Muestra el modal de carga
        const savedToken = await AsyncStorage.getItem('accessToken');
        if (!savedToken) {
          setShowSessionExpired(true); // Muestra el modal de sesión expirada si no hay token
          navigation.navigate('/')
        } else {
          setIsTokenVerified(true); // Marca el token como verificado
        }
      } catch (error) {
        console.error('Error al cargar el token:', error);
      } finally {
        setIsLoading(false); // Oculta el modal de carga después del chequeo
      }
    };

    loadToken();
  }, []);

  const organizationContext = useContext(OrganizationContext);

  if (!organizationContext) {
    throw new Error('organization context debe ser utilizado dentro de un OrganizationProvider');
  }

  const { addMember, updateMember, viewMember, updateRanch } = organizationContext;

  if (isLoading) {
    return <LoadingModal visible={true} />;
  }

  if (showSessionExpired) {
    return <ExpiredSessionModal visible={true} />;
  }

  if (addMember || updateMember) {
    return <AddMemberScreen />;
  } else if (viewMember) {
    return <MemberProfile />;
  } else if (updateRanch) {
    return <CreateRanch />;
  } else {
    return <Organization />;
  }
}
