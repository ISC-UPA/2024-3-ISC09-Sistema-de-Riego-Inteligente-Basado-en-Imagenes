import React, { useState, useEffect } from "react";
import CreateRanch from "@/components/ranch/CreateRanch";
import LoadingModal from "@/components/widgets/LoadingModal";
import ExpiredSessionModal from "@/components/widgets/ExpiredSession";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateRanchScreen() {
  const [isLoading, setIsLoading] = useState(true); // Estado para el modal de carga
  const [showSessionExpired, setShowSessionExpired] = useState(false); // Estado para el modal de sesión expirada

  useEffect(() => {
    const checkToken = async () => {
      try {
        setIsLoading(true); // Muestra el modal de carga
        const savedToken = await AsyncStorage.getItem("accessToken");
        if (!savedToken) {
          setShowSessionExpired(true); // Muestra el modal de sesión expirada si no hay token
          navigation.navigate("/")
        }
      } catch (error) {
        console.error("Error al verificar el token:", error);
      } finally {
        setIsLoading(false); // Oculta el modal de carga después de la verificación
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
    return <ExpiredSessionModal visible={true}/>;
  }

  // Renderizar el componente principal si el token es válido
  return <CreateRanch />;
}
