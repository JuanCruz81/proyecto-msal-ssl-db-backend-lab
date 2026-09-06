
export const ROLES_SISTEMA = [
  { id: 'role-1', name: 'Director de Infraestructura y Cloud' },
  // Sub-roles del Director:
  { id: 'role-1-1', name: 'Arquitecto Cloud Senior', parentId: 'role-1' },
  { id: 'role-1-2', name: 'Administrador de Redes', parentId: 'role-1' },

  { id: 'role-2', name: 'Admin Senior de Seguridad y Cumplimiento' },
  // Sub-roles de Seguridad:
  { id: 'role-2-1', name: 'Auditor de TI y Cumplimiento', parentId: 'role-2' },
  { id: 'role-2-2', name: 'Analista de Vulnerabilidades', parentId: 'role-2' },

  { id: 'role-3', name: 'Ingeniero Principal de QA Automation' },
  { id: 'role-4', name: 'Coordinador de Arquitectura de Datos' }
];
