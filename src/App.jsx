import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'
import { ProveedorContexto } from './miContexto.jsx'
import { Users } from './Users.jsx'
import { Orders } from './Orders.jsx'

export default function App() {
  return (
    <ProveedorContexto>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </BrowserRouter>
    </ProveedorContexto>
  )
}
