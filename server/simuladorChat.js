// simuladorChat.js
import { EventEmitter } from 'events';
import readline from 'readline';

class DiscordMock extends EventEmitter {
    inyectarMensajeDesdeConsola(texto) {
        this.emit('messageCreate', {
            author: { username: "Admin_Pruebas", bot: false },
            content: texto,
            reply: async (respuesta) => console.log(`\n🤖 [Discord Bot]: ${respuesta}`)
        });
    }
}

const client = new DiscordMock();

// Aquí pones la lógica que estás practicando para procesar los mensajes
client.on('messageCreate', async (message) => {
    if (!message.content.startsWith('!')) return;

    if (message.content.startsWith('!aprobar')) {
        const partes = message.content.split(' ');
        const id = partes[1] || 'Sin ID';

        console.log(`\n⚙️ [Tu Backend] Ejecutando lógica interna para el ID: ${id}`);

        // AQUÍ MÁS ADELANTE PODRÁS LLAMAR A LAS FUNCIONES DE TU PROPIA APP
        // Ej: await miControladorDeUsuarios.aprobarRol(id);

        await message.reply(`✅ Solicitud ${id} procesada con éxito en el servidor local.`);
    }
});

// Función que arranca el prompt en la consola
export function iniciarSimuladorChat() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log('\n🎮 [Simulador] Consola interactiva de Discord acoplada al servidor.');
    console.log('Escribe un comando (ej: !aprobar 4545) directamente aquí abajo:\n');

    function preguntar() {
        rl.question('💬 [Chat Discord Mock]: ', (texto) => {
            if (texto.trim()) {
                client.inyectarMensajeDesdeConsola(texto);
            }
            console.log(''); // Salto de línea estético
            preguntar(); // Mantiene el bucle abierto
        });
    }
    preguntar();
}
