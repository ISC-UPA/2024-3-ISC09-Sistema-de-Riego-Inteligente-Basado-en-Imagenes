import React, { useContext } from 'react';
import { FAB } from 'react-native-paper';
import { CropContext } from '@/components/context/CropContext';


export default function AddButton(){
    const cropContext = useContext(CropContext);

    // Verifica que cropContext no sea undefined
    if (!cropContext) {
        throw new Error('CropContext debe estar dentro del proveedor CropProvider');
    }

    const { setAddCrop } = cropContext; 

    return (
        <FAB
            icon="plus"
            style={{
            position: 'absolute',
            right: 16,
            bottom: 16,
            backgroundColor: '#bae6fd'
            
            }}
            onPress={() => setAddCrop(true)}  
        />
    )
};

