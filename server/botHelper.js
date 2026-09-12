// import 'dotenv/config'; // Asegura la carga de variables de entorno

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Configurar __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Esto busca el archivo .env EXACTAMENTE en la misma carpeta donde está este botHelper.js
// Si tu archivo .env está en la raíz (un nivel arriba), cambia '__dirname' por 'path.join(__dirname, "..")'
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Envía una notificación formateada al estilo tarjeta de Teams hacia Discord.
 * Simula botones de acción mediante enlaces interactivos.
 * 
 * @param {string} usuarioId - ID del usuario afectado
 * @param {Array<string>} roles - Lista de roles asignados
 */
export async function notifyDiscord(usuarioId, roles) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('Error: Falta la variable DISCORD_WEBHOOK_URL en el archivo .env');
    return;
  }

  // Estructura estilo "Card" (Embed) de Discord parecida a Microsoft Teams
  const message = {
    embeds: [
      {
        title: "🔄 Solicitud de Confirmación de Roles",
        description: `El usuario **<@${usuarioId}>** requiere verificar la asignación de sus nuevos accesos. ¿Deseas confirmar esta operación?`,
        color: 6202075, // Color púrpura/azul similar al branding de Teams
        fields: [
          {
            name: "👤 ID de Usuario",
            value: `\`${usuarioId}\``,
            inline: true
          },
          {
            name: "🛡️ Roles Solicitados",
            value: roles.map(r => `\`${r}\``).join(', '),
            inline: true
          },
          {
            name: "⚡ Acciones Requeridas",
            // Los Webhooks no soportan botones reales, pero emulamos la acción usando enlaces Markdown estilizados
            value: "[🟢 Aprobar y Enviar (Submit)](https://tu-backend.com)  |  [🔴 Cancelar](https://tu-backend.com)"
          }
        ],
        footer: {
          text: "Sistema de Gestión de Accesos • Microsoft Teams Style"
        },
        timestamp: new Date().toISOString()
      }
    ]
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
    console.log('¡Tarjeta de notificación enviada con éxito!');
  } catch (error) {
    console.error('Error al emular la notificación:', error.message);
  }
}

/* 
=============================================================================
📝 ANEXO: ESTRUCTURA DE UNA ADAPTIVE CARD PARA MICROSOFT TEAMS
=============================================================================
Si estuvieras enviando esto a un Webhook de Microsoft Teams directamente, 
este sería el objeto JSON exacto (AdaptiveCard v1.5) que genera una tarjeta 
real con un cuadro de texto, un botón de Submit y uno de Cancelar:

const teamsMessage = {
  "type": "message",
  "attachments": [
    {
      "contentType": "application/vnd.microsoft.card.adaptive",
      "content": {
        "type": "AdaptiveCard",
        "body": [
          {
            "type": "TextBlock",
            "size": "Medium",
            "weight": "Bolder",
            "text": "🔔 Notificación de Sistema: Validación de Roles"
          },
          {
            "type": "FactSet",
            "facts": [
              { "title": "ID Usuario:", "value": usuarioId },
              { "title": "Roles:", "value": roles.join(', ') }
            ]
          },
          {
            "type": "Input.Text",
            "id": "userComment",
            "placeholder": "Escribe una justificación opcional...",
            "isMultiline": true
          }
        ],
        "actions": [
          {
            "type": "Action.Submit",
            "title": "Submit / Aprobar",
            "data": { "action": "approve", "userId": usuarioId }
          },
          {
            "type": "Action.Execute",
            "title": "Cancel",
            "data": { "action": "cancel" }
          }
        ],
        "$schema": "http://adaptivecards.io",
        "version": "1.5"
      }
    }
  ]
};
*/
