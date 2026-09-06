import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Shield, Search, X } from 'lucide-react';
import { ROLES_SISTEMA } from './constants';
import { butSupDer, // popup, 
  footCan, footSav } from './styles';
import { useMiContexto } from './miContexto';
import { mapearUsuarioAInteger } from './utils';

export default function AsignarRolesVista() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoles, setSelectedRoles] = useState({});
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const { datosCompartidos } = useMiContexto(); // <-- Usamos el contexto para obtener datos compartidos

  const buttonRef = useRef(null);
  const popupRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Calcular la posición física exacta en la pantalla al hacer clic
  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const popupWidth = 360; // Ancho fijo del popup en píxeles

      // Forzamos al popup a posicionarse abajo del botón y crecer hacia la izquierda de la pantalla
      setCoords({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right + window.scrollX - popupWidth
      });
    }
    setIsOpen(!isOpen);
  };

  // Cerrar el popup de forma inteligente si haces clic afuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current && !popupRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredRoles = useMemo(() => {
    return ROLES_SISTEMA.filter(role =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleCheckboxChange = (roleId) => {
    setSelectedRoles(prev => ({ ...prev, [roleId]: !prev[roleId] }));
  };

  const handleSave = async () => {
    const asignados = Object.keys(selectedRoles).filter(id => selectedRoles[id]);
    console.log("Roles seleccionados:", asignados);

    // Opcional: Validar que haya seleccionado al menos uno si es obligatorio
    if (asignados.length === 0) {
      alert("Por favor, selecciona al menos un rol.");
      return;
    }

    try {
      // 2. Realizar la llamada a tu endpoint de Node.js
      const response = await fetch(`${API_URL}/usuarios/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // Si usas tokens de autenticación
        },
        body: JSON.stringify({
          usuarioId: mapearUsuarioAInteger(datosCompartidos.username), // Reemplaza por el ID dinámico del usuario que estás editando
          roles: asignados // Enviamos el arreglo ['role-1', 'role-1-1', ...]
        }),
      });

      // 3. Verificar si el servidor respondió con un estatus de éxito
      if (!response.ok) {
        throw new Error('Error en el servidor al intentar guardar los roles.');
      }

      const data = await response.json();
      console.log("Guardado con éxito en el backend:", data);

      // 4. Si todo salió bien, cerramos el modal (tu lógica original)
      // setIsOpen(false);

    } catch (error) {
      // 5. Capturar fallos de red o errores lanzados en el bloque try
      console.error("Error al conectar con la API:", error);
      alert("No se pudieron guardar los cambios. Inténtalo de nuevo.");
    }

    setIsOpen(false);
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f9fafb', padding: '24px', position: 'relative' }}>

      {/* Botón superior derecho (Anclado con CSS nativo puro) */}
      <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 9999 }}>
        <button
          ref={buttonRef}
          onClick={handleToggle}
          style={butSupDer}
          title="Asignar Roles"
        >
          <Shield style={{ width: '24px', height: '24px' }} />
        </button>
      </div>

      {/* Fondo de la interfaz */}
      <div style={{ maxWidth: '56rem', margin: '48px auto 0 auto', fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>Panel de Administración</h1>
        <p style={{ color: '#4b5563' }}>Presiona el escudo morado. El popup forzará su aparición usando CSS directo del navegador.</p>
      </div>

      {/* --- EL POPUP USANDO PORTAL Y CSS NATIVO (Cero dependencias de archivos o Tailwind) --- */}
      {isOpen && createPortal(
        <div
          ref={popupRef}
          style={
            {
              position: 'absolute',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: '360px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '1px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '450px',
              overflow: 'hidden',
              fontFamily: 'sans-serif',
              zIndex: 99999999 // Capa absoluta máxima en el navegador
            }
          }
        >
          {/* Cabecera */}
          <div style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'between', backgroundColor: '#f9fafb' }}>
            <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#111827', flex: 1 }}>Roles del Sistema</h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1.25rem' }}
            >
              &times;
            </button>
          </div>

          {/* Buscador */}
          <div style={{ padding: '8px 16px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff' }}>
            <Search style={{ width: '14px', height: '14px', color: '#9ca3af', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Buscar rol por nombre largo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.75rem', color: '#374151' }}
            />
          </div>

          <div style={{ padding: '2px', overflowY: 'auto', flex: 1, backgroundColor: '#ffffff' }}>
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role) => {
                const isChild = !!role.parentId; // Verifica si es un checkbox interno

                return (
                  <label
                    key={role.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px', // Un poco más de espacio entre checkbox y texto
                      // Si es hijo, empuja el elemento 20px a la derecha y reduce su padding vertical
                      padding: isChild ? '2px 2px 2px 20px' : '4px 2px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      userSelect: 'none',
                      // Los sub-roles se ven ligeramente más pequeños y con texto más suave
                      fontSize: isChild ? '0.7rem' : '0.75rem',
                      opacity: isChild ? 0.9 : 1,
                      backgroundColor: selectedRoles[role.id] ? '#f5f3ff' : 'transparent',
                      borderBottom: '1px solid #f9fafb'
                    }}
                    onMouseEnter={(e) => !selectedRoles[role.id] && (e.currentTarget.style.backgroundColor = '#f9fafb')}
                    onMouseLeave={(e) => !selectedRoles[role.id] && (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <input
                      type="checkbox"
                      checked={!!selectedRoles[role.id]}
                      onChange={() => handleCheckboxChange(role.id)}
                      style={{
                        width: '14px',
                        height: '14px',
                        accentColor: '#4f46e5',
                        flexShrink: 0,
                        cursor: 'pointer'
                      }}
                    />
                    <span
                      style={{
                        fontWeight: isChild ? 400 : 500, // Texto normal para hijos, semibold para padres
                        color: isChild ? '#4b5563' : '#1f2937',
                        lineHeight: '1.25'
                      }}
                    >
                      {role.name}
                    </span>
                  </label>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#9ca3af', fontSize: '0.75rem' }}>
                No se encontraron coincidencias.
              </div>
            )}
          </div>

          {/* Acciones del Footer */}
          <div style={{ padding: '12px', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', backgroundColor: '#f9fafb' }}>
            <button
              onClick={() => setIsOpen(false)}
              style={footCan}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              style={footSav}
            >
              Guardar Cambios
            </button>
          </div>

        </div>,
        document.body
      )}

    </div>
  );
}
