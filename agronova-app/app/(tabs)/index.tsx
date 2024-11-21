import React, { useContext } from 'react';
import CropsList from '@/components/crops/CropsList';
import Crop from '@/components/crops/Crop'; // Componente que muestra detalles del cultivo
import CropRecords from '@/components/crops/CropRecords'; // Asegúrate de importar el componente de estadísticas
import CropStatistics from '@/components/crops/CropStatistics';
import CreateCrop from '@/components/crops/CreateCrop';
import { CropContext } from '@/components/context/CropContext'; // Usamos CropContext


export default function HomeScreen() {
  const cropContext = useContext(CropContext); // Nos suscribimos al CropContext

  if (!cropContext) {
    throw new Error('HomeScreen debe ser utilizado dentro de un CropProvider');
  }

  const { selectedCropId, record, statistics, addCrop, updateCrop  } = cropContext; // Accedemos al `selectedCropId` y `record` del contexto

  // Lógica para renderizar las diferentes vistas dependiendo del estado de `record` y `selectedCropId`
  if (record) {
    return <CropRecords />;
  }
  else if(statistics){
    return<CropStatistics />
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
