import React, { useContext, useEffect, useState } from 'react';
import CropsList from '@/components/crops/CropsList';
import Crop from '@/components/crops/Crop';
import CropRecords from '@/components/crops/CropRecords';
import CropStatistics from '@/components/crops/CropStatistics';
import CreateCrop from '@/components/crops/CreateCrop';
import IAimagesList from '@/components/iaimages/iaimage';
import LoadingModal from '@/components/widgets/LoadingModal';
import ExpiredSessionModal from '@/components/widgets/ExpiredSession';
import { CropContext } from '@/components/context/CropContext';
import { OrganizationContext } from '@/components/context/OrganizationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const cropContext = useContext(CropContext);
  const organizationContext = useContext(OrganizationContext);

  if (!cropContext || !organizationContext) {
    throw new Error('HomeScreen debe ser utilizado dentro de un Provider');
  }

  const { selectedCropId, record, statistics, images, addCrop, updateCrop } = cropContext;

  const [isLoading, setIsLoading] = useState(true); // Estado para el modal de carga
  const [showSessionExpired, setShowSessionExpired] = useState(false); // Estado para el modal de sesión expirada

  useEffect(() => {
    const checkToken = async () => {
      try {
        setIsLoading(true); // Muestra el modal de carga
        const savedToken = await AsyncStorage.getItem('accessToken');
        if (!savedToken) {
          setShowSessionExpired(true); // Muestra el modal de sesión expirada si no hay token
          navigation.navigate('/')
        }
      } catch (error) {
        console.error('Error al verificar el token:', error);
      } finally {
        setIsLoading(false); // Oculta el modal de carga
      }
    };

    checkToken();
  }, []);

  // Mostrar el modal de carga mientras se verifica el token
  if (isLoading) {
    return <LoadingModal visible={true} />;
  }

  // Mostrar el modal de sesión expirada si no hay token
  if (showSessionExpired) {
    return <ExpiredSessionModal visible={true} />;
  }

  // Lógica para renderizar las diferentes vistas dependiendo del estado de `record`, `statistics`, etc.
  if (record) {
    return <CropRecords />;
  } else if (statistics) {
    return <CropStatistics />;
  } else if (images) {
    return <IAimagesList />;
  } else if (addCrop || updateCrop) {
    return <CreateCrop />;
  } else {
    return (
      <>
        {selectedCropId !== null && selectedCropId !== 0 ? (
          <Crop />
        ) : (
          <CropsList />
        )}
      </>
    );
  }
}
