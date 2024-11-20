import React, { useContext } from 'react';
import CropsList from '@/components/crops/CropsList';
import Crop from '@/components/crops/Crop'; // Componente que muestra detalles del cultivo
import CropRecords from '@/components/crops/CropRecords'; // Asegúrate de importar el componente de estadísticas
import CropStatistics from '@/components/crops/CropStatistics';
import { CropContext } from '@/components/context/CropContext'; // Usamos CropContext
import { OrganizationContext } from '@/components/context/OrganizationContext';
import HelpSupport from '@/components/help/HelpSupport';

export default function HomeScreen() {
  const cropContext = useContext(CropContext); // Nos suscribimos al CropContext
  const organizationContext = useContext(OrganizationContext);

  if (!cropContext ||!organizationContext ) {
    throw new Error('HomeScreen debe ser utilizado dentro de un Provider');
  }

  const { selectedCropId, record, statistics  } = cropContext; // Accedemos al `selectedCropId` y `record` del contexto
  const {help} = organizationContext;

  // Lógica para renderizar las diferentes vistas dependiendo del estado de `record` y `selectedCropId`
  if (record) {
    // Si `record` es true, renderizamos `CropStatistics`
    return <CropRecords />;
  }
  else if(statistics){
    return<CropStatistics />
  }
  else if(help){
    return <HelpSupport></HelpSupport>
  }

  return (
    <>
      {selectedCropId !== null && selectedCropId !== 0 ? (
        <Crop />  // Muestra el componente Crop cuando el `selectedCropId` no es 0 ni null
      ) : (
        <CropsList />  // Muestra la lista de cultivos cuando el `selectedCropId` es 0 o null
      )}
    </>
  );
}
