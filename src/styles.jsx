
export const butSupDer = {
    padding: '12px',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    borderRadius: '9999px',
    border: 'none',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}

// export const popup = {
//     position: 'absolute',
//     top: `${coords.top}px`,
//     left: `${coords.left}px`,
//     width: '360px',
//     backgroundColor: '#ffffff',
//     borderRadius: '12px',
//     boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
//     border: '1px solid #e5e7eb',
//     display: 'flex',
//     flexDirection: 'column',
//     maxHeight: '450px',
//     overflow: 'hidden',
//     fontFamily: 'sans-serif',
//     zIndex: 99999999 // Capa absoluta máxima en el navegador
// }

// const labCheckbox = {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '6px', // Un poco más de espacio entre checkbox y texto
//     // Si es hijo, empuja el elemento 20px a la derecha y reduce su padding vertical
//     padding: isChild ? '2px 2px 2px 20px' : '4px 2px',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     userSelect: 'none',
//     // Los sub-roles se ven ligeramente más pequeños y con texto más suave
//     fontSize: isChild ? '0.7rem' : '0.75rem',
//     opacity: isChild ? 0.9 : 1,
//     backgroundColor: selectedRoles[role.id] ? '#f5f3ff' : 'transparent',
//     borderBottom: '1px solid #f9fafb'
// }

export const footCan = {
    padding: '6px 12px',
    fontSize: '11px',
    fontWeight: 500,
    color: '#374151',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer'
}

export const footSav = {
    padding: '6px 12px',
    fontSize: '11px',
    fontWeight: 500,
    color: '#ffffff',
    backgroundColor: '#4f46e5',
    border: 'none',
    borderRadius: '6px',
    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
    cursor: 'pointer'
}

// Agrega esta constante en tu archivo Dashboard.jsx para alimentar los estilos del formulario
export const styles = {
  card: { 
    maxWidth: '450px', 
    margin: '40px auto', 
    padding: '24px', 
    borderRadius: '8px', 
    border: '1px solid #e0e0e0', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
    fontFamily: 'system-ui, sans-serif',
    backgroundColor: '#ffffff'
  },
  title: { 
    margin: '0 0 20px 0', 
    fontSize: '20px', 
    color: '#202124', 
    textAlign: 'center' 
  },
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '16px' 
  },
  group: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '6px' 
  },
  label: { 
    fontSize: '14px', 
    fontWeight: '500', 
    color: '#5f6368',
    textAlign: 'left'
  },
  input: { 
    padding: '10px', 
    fontSize: '15px', 
    borderRadius: '4px', 
    border: '1px solid #dadce0', 
    outline: 'none' 
  },
  button: { 
    padding: '12px', 
    fontSize: '15px', 
    fontWeight: '600', 
    color: '#fff', 
    backgroundColor: '#1a73e8', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer' 
  },
  alert: { 
    marginTop: '20px', 
    padding: '12px', 
    borderRadius: '4px', 
    fontSize: '14px', 
    textAlign: 'center', 
    fontWeight: '500' 
  }
};
