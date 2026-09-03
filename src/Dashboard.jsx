import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, LogOut, CheckCircle } from 'lucide-react'
// import './Dashboard.css' // <-- Importación del archivo CSS tradicional
import './Dashboard.css' // <-- Importación del archivo CSS tradicional

const initialUsers = [
  { id: 1, name: 'Carlos Mendoza', email: 'carlos@ejemplo.com', roles: ['user'] },
  { id: 2, name: 'Ana Gómez', email: 'ana@ejemplo.com', roles: ['admin', 'user'] },
  { id: 3, name: 'Luis Peralta', email: 'luis@ejemplo.com', roles: ['editor'] },
]

const AVAILABLE_ROLES = [
  { id: 'admin', label: 'Administrador' },
  { id: 'editor', label: 'Editor' },
  { id: 'user', label: 'Usuario Estándar' }
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [users, setUsers] = useState(initialUsers)
  const [notification, setNotification] = useState('')

  const handleRoleChange = (userId, roleId) => {
    setUsers(prevUsers => 
      prevUsers.map(user => {
        if (user.id === userId) {
          const hasRole = user.roles.includes(roleId)
          const newRoles = hasRole 
            ? user.roles.filter(r => r !== roleId)
            : [...user.roles, roleId]
          
          return { ...user, roles: newRoles }
        }
        return user
      })
    )
  }

  const handleSaveChanges = () => {
    setNotification('¡Permisos actualizados correctamente!')
    setTimeout(() => setNotification(''), 3000)
    console.log('Nuevos permisos guardados:', users)
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <Shield size={24} color="#38bdf8" />
          <h1 className="dashboard-title">Panel de Roles y Permisos</h1>
        </div>
        <button onClick={() => navigate('/')} className="logout-btn">
          <LogOut size={18} />
          Salir
        </button>
      </header>

      {notification && (
        <div className="dashboard-alert">
          <CheckCircle size={18} />
          {notification}
        </div>
      )}

      <main className="dashboard-main">
        <div className="table-responsive">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th className="dashboard-th">Usuario / Correo</th>
                {AVAILABLE_ROLES.map(role => (
                  <th key={role.id} className="dashboard-th dashboard-th-center">
                    {role.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="dashboard-tr">
                  <td className="dashboard-td">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </td>
                  {AVAILABLE_ROLES.map(role => (
                    <td key={role.id} className="dashboard-td dashboard-td-center">
                      <input
                        type="checkbox"
                        checked={user.roles.includes(role.id)}
                        onChange={() => handleRoleChange(user.id, role.id)}
                        className="role-checkbox"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dashboard-actions">
          <button onClick={handleSaveChanges} className="save-btn">
            Guardar Cambios
          </button>
        </div>
      </main>
    </div>
  )
}
