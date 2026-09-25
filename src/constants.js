export const ROLES_SISTEMA = [
  { id: 'role-1', name: 'Director de Infraestructura y Cloud', usernames: ['alice'] },
  // Sub-roles del Director:
  { id: 'role-1-1', name: 'Arquitecto Cloud Senior', parentId: 'role-1', usernames: ['bob'] },
  { id: 'role-1-2', name: 'Administrador de Redes', parentId: 'role-1', usernames: [] },

  { id: 'role-2', name: 'Admin Senior de Seguridad y Cumplimiento', usernames: ['alice'] },
  // Sub-roles de Seguridad:
  { id: 'role-2-1', name: 'Auditor de TI y Cumplimiento', parentId: 'role-2', usernames: [] },
  { id: 'role-2-2', name: 'Analista de Vulnerabilidades', parentId: 'role-2', usernames: [] },

  { id: 'role-3', name: 'Ingeniero Principal de QA Automation', usernames: ['bob'] },
  { id: 'role-4', name: 'Coordinador de Arquitectura de Datos', usernames: [] }
];

export const objetoOriginal = {
  item1: { id: "101", nombre: "Producto A" },
  item2: { id: "102", nombre: "Producto B" },
  item3: { id: "103", nombre: "Producto C" }
};

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

export const objetoOrdenes = {
  order_001: { id: "1", orderNumber: "ORD-2026-A", queueName: "orders.create.v1", exchange: "amq.direct", routingKey: "order.created", priority: "High" },
  order_002: { id: "2", orderNumber: "ORD-2026-B", queueName: "orders.ship.v1", exchange: "shipping.topic", routingKey: "order.shipped", priority: "Medium" },
  order_003: { id: "3", orderNumber: "ORD-2026-C", queueName: "orders.cancel.v1", exchange: "amq.direct", routingKey: "order.cancelled", priority: "Low" }
};

