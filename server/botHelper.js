// FUNCIÓN PARA EMULAR NOTIFICACIÓN VÍA WEBHOOK
export async function sendNotification(usuarioId, roles) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('Error: Falta la variable DISCORD_WEBHOOK_URL en el archivo .env');
    return;
  }

  // Estructura de mensaje limpia usando Markdown nativo de Discord
  const message = {
    content: `🔔 **[NOTIFICACIÓN DE SISTEMA]**\n` +
             `• **ID de Usuario:** \`${usuarioId}\`\n` +
             `• **Nuevos Roles Asignados:** ${roles.map(r => `\`${r}\``).join(', ')}`
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      throw new Error(`Error en el Webhook: ${response.status}`);
    }
    console.log('¡Notificación de emulación enviada con éxito!');
  } catch (error) {
    console.error('Error al emular la notificación:', error.message);
  }
}
