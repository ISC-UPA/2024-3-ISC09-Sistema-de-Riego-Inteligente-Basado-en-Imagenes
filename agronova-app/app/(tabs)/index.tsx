import React, { useContext } from 'react';
import CropsList from '@/components/crops/CropsList';
import Crop from '@/components/crops/Crop'; // Componente que muestra detalles del cultivo
import { CropContext } from '@/components/context/CropContext'; // Usamos CropContext

export default function HomeScreen() {
  const cropContext = useContext(CropContext); // Nos suscribimos al CropContext

  if (!cropContext) {
    throw new Error('HomeScreen debe ser utilizado dentro de un CropProvider');
  }

  const { selectedCropId } = cropContext; // Accedemos al `selectedCropId` del contexto

  // Dependiendo del valor de `selectedCropId`, mostramos uno u otro componente
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
