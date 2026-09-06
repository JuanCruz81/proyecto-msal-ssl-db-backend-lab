
// method to map username to integer
export function mapearUsuarioAInteger(username) {
  const mapaUsuarios = {
    "Invitado": 1,
    "juan001": 2,
    "maria002": 3,
    "carlos_admin": 4
  };

  // Si el username existe en el mapa, devuelve su ID. Si no, devuelve 0.
  return mapaUsuarios[username] ?? 0;
}