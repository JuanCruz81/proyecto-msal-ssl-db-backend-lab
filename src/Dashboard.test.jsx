import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';
import { useMiContexto } from './miContexto';

// 1. Reemplazamos el módulo del contexto con un Mock simulado
vi.mock('./miContexto', () => ({
  useMiContexto: vi.fn(),
}));

describe('Pruebas Unitarias para el Modal de Selección de Roles', () => {
  // Configuración de variables simuladas antes de cada test
  const mockContextoValue = {
    datosCompartidos: { username: 'juan001', tema: 'claro' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Hacemos que useMiContexto devuelva siempre los datos de prueba por defecto
    useMiContexto.mockReturnValue(mockContextoValue);
    
    // Mock global de la función fetch para simular el envío a la API (puerto 4000)
    global.fetch = vi.fn();
  });

  // --- TEST 1: RENDERIZADO ---
  test('debe mostrar los checkboxes de los roles en pantalla', () => {
    render(<Dashboard />);
    
    // Suponiendo que tu rol en la UI tiene un label o un texto legible
    const checkboxRol = screen.getByLabelText(/role-1-1/i) || screen.getByRole('checkbox', { name: /role-1-1/i });
    expect(checkboxRol).toBeInTheDocument();
    expect(checkboxRol).not.toBeChecked(); // Debe iniciar desmarcado
  });

  // --- TEST 2: INTERACCIÓN CON EL MODAL / FORMULARIO ---
  test('debe cambiar el estado del checkbox al hacer clic', () => {
    render(<Dashboard />);
    
    const checkboxRol = screen.getByRole('checkbox', { name: /role-1-1/i });
    
    // Simulamos que el usuario hace clic para seleccionar el rol
    fireEvent.click(checkboxRol);
    expect(checkboxRol).toBeChecked(); // Ahora debe estar marcado

    // Desmarcar de nuevo
    fireEvent.click(checkboxRol);
    expect(checkboxRol).not.toBeChecked();
  });

  // --- TEST 3: ENVÍO EXITOSO DE DATOS (MOCK DE API) ---
  test('debe enviar el payload correcto a la API al hacer clic en Guardar', async () => {
    // Simulamos una respuesta exitosa (status 200) de la API
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: "Guardado" }),
    });

    render(<Dashboard />);
    
    // 1. Seleccionamos el rol
    const checkboxRol = screen.getByRole('checkbox', { name: /role-1-1/i });
    fireEvent.click(checkboxRol);
    
    // 2. Buscamos el botón de guardar (visto en tu handleSave de la consola)
    const botonGuardar = screen.getByRole('button', { name: /Guardar/i });
    fireEvent.click(botonGuardar);

    // 3. Verificamos que se haya ejecutado la petición fetch al puerto 4000 con los datos adecuados
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://localhost:4000/api/v1/usuarios/roles',
        expect.objectContaining({
          method: 'POST',
          // Verificamos que el body lleve el array con 'role-1-1'
          body: expect.stringContaining('role-1-1') 
        })
      );
    });
  });

  // --- TEST 4: MANEJO DE ERRORES DE API ---
  test('debe capturar el error y lanzar console.error si la API falla', async () => {
    // Capturamos el spy del console.error para verificar que se use al fallar
    const spyConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Simulamos un fallo de red ("Failed to fetch" como el de tu captura)
    global.fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    render(<Dashboard />);
    
    const botonGuardar = screen.getByRole('button', { name: /Guardar/i });
    fireEvent.click(botonGuardar);

    // Esperamos a que la promesa falle y el catch actúe
    await waitFor(() => {
      expect(spyConsoleError).toHaveBeenCalledWith(
        expect.stringContaining('Error al conectar con la API')
      );
    });

    spyConsoleError.mockRestore();
  });
});
