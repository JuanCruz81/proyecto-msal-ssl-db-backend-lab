import React from 'react';
import { objetoOrdenes } from './constants';
import { useState, useEffect } from 'react';

export const Orders = ({ }) => {

    const [listaRenderizada, setListaRenderizada] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        async function cargarPropiedades() {
            try {
                const itemsArray = Object.values(objetoOrdenes);
                const promesas = itemsArray.map(async (item) => {
                    // Simular latencia de red de la API de RabbitMQ
                    await new Promise(resolve => setTimeout(resolve, 500));

                    // Emular la llamada al HTTP API de RabbitMQ para obtener datos en tiempo real de la cola
                    const mockRabbitMqResponse = {
                        messagesReady: Math.floor(Math.random() * 50), // Mensajes encolados en este momento
                        consumersCount: item.priority === "High" ? 5 : 2, // Consumidores activos
                        status: "running" // Estado del nodo RabbitMQ
                    };

                    // Combinamos las múltiples columnas locales con los datos dinámicos de RabbitMQ
                    return {
                        ...item,
                        messages: mockRabbitMqResponse.messagesReady,
                        consumers: mockRabbitMqResponse.consumersCount,
                        queueStatus: mockRabbitMqResponse.status
                    };
                });

                const resultadosFinales = await Promise.all(promesas);
                setListaRenderizada(resultadosFinales);
            } catch (error) {
                console.error("Error al consultar el endpoint de RabbitMQ:", error);
            } finally {
                setCargando(false);
            }
        }

        cargarPropiedades();
    }, []);

    if (cargando) {
        return <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>Cargando el estado de RabbitMQ...</div>;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Panel de Control - Órdenes y Colas RabbitMQ</h2>
            
            <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th>ID</th>
                        <th>Nº Órden</th>
                        <th>Nombre Cola (RabbitMQ)</th>
                        <th>Exchange</th>
                        <th>Routing Key</th>
                        <th>Prioridad</th>
                        <th>Msg Listos</th>
                        <th>Consumidores</th>
                        <th>Estado Cola</th>
                    </tr>
                </thead>
                <tbody>
                    {listaRenderizada.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td><strong>{item.orderNumber}</strong></td>
                            <td><code>{item.queueName}</code></td>
                            <td>{item.exchange}</td>
                            <td><code>{item.routingKey}</code></td>
                            <td>
                                <span style={{ 
                                    color: item.priority === 'High' ? 'red' : item.priority === 'Medium' ? 'orange' : 'green',
                                    fontWeight: 'bold' 
                                }}>
                                    {item.priority}
                                </span>
                            </td>
                            {/* Columnas dinámicas inyectadas desde la simulación de la API */}
                            <td>{item.messages}</td>
                            <td>{item.consumers} act.</td>
                            <td>
                                <span style={{ color: 'green', fontWeight: 'bold' }}>
                                    ● {item.queueStatus}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
