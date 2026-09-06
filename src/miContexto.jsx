// MiContexto.jsx
import React, { createContext, useState, useContext } from 'react';

// 1. Inicializamos el contexto vacío
const MiContexto = createContext();

// 2. Creamos el componente Proveedor
export function ProveedorContexto({ children }) {
  // Aquí declaras el estado que quieres compartir entre tus archivos
  const [datosCompartidos, setDatosCompartidos] = useState({
    username: "Invitado",
    carrito: [],
    tema: "claro"
  });

  // Función opcional para actualizar partes específicas de forma segura
  const actualizarUsername = (nuevoNombre) => {
    setDatosCompartidos((prev) => ({ ...prev, username: nuevoNombre }));
  };

  return (
    // Pasamos el estado y las funciones modificadoras en el "value"
    <MiContexto.Provider value={{ datosCompartidos, setDatosCompartidos, actualizarUsername }}>
      {children}
    </MiContexto.Provider>
  );
}

// 3. Hook personalizado para exportar y usar en cualquier archivo .jsx
export function useMiContexto() {
  const contexto = useContext(MiContexto);
  if (!contexto) {
    throw new Error("useMiContexto debe ser usado dentro de un ProveedorContexto");
  }
  return contexto;
}
