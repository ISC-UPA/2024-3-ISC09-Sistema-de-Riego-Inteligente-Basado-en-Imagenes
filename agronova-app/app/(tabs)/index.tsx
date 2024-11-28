import React, { useContext } from 'react';
import CropsList from '@/components/crops/CropsList';
import Crop from '@/components/crops/Crop'; // Componente que muestra detalles del cultivo
import CropRecords from '@/components/crops/CropRecords'; // Asegúrate de importar el componente de estadísticas
import CropStatistics from '@/components/crops/CropStatistics';
import CreateCrop from '@/components/crops/CreateCrop';
import { CropContext } from '@/components/context/CropContext'; // Usamos CropContext
import { OrganizationContext } from '@/components/context/OrganizationContext';
import HelpSupport from '@/components/help/HelpSupport';
import IAimagesList from '@/components/iaimages/iaimage';


export default function HomeScreen() {
  const cropContext = useContext(CropContext); // Nos suscribimos al CropContext
  const organizationContext = useContext(OrganizationContext);

  if (!cropContext ||!organizationContext ) {
    throw new Error('HomeScreen debe ser utilizado dentro de un Provider');
  }

  const { selectedCropId, record, statistics, images, addCrop, updateCrop  } = cropContext; // Accedemos al `selectedCropId` y `record` del contexto

  // Lógica para renderizar las diferentes vistas dependiendo del estado de `record` y `selectedCropId`
  if (record) {
    return <CropRecords />;
  }
  else if(statistics){
    return<CropStatistics />
  }
  else if(images){
    return<IAimagesList/>
  }
  else if(addCrop || updateCrop){
    return <CreateCrop/>
  }

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
