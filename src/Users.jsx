import React from 'react';
import { objetoOriginal } from './constants';
import { useState, useEffect } from 'react';

export const Users = ({ }) => {

    const [listaRenderizada, setListaRenderizada] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        async function cargarPropiedades() {
            try {
                const itemsArray = Object.values(objetoOriginal);
                const promesas = itemsArray.map(async (item) => {
                    await new Promise(resolve => setTimeout(resolve, 500));

                    // const respuesta = await fetch(`https://tuweb.com{item.id}`);
                    // const datosExtra = await respuesta.json();
                    // return {
                    //   ...item,
                    //   propiedadExtra: datosExtra.valor // Ajusta 'valor' según la respuesta de tu API
                    // };

                    // emular la llamada a un endpoint externo para obtener la propiedad adicional
                    const mockApiResponse = {
                        source: `Database_Cluster_${item.id}` // El valor que devuelve la propiedad 'source'
                    };

                    return {
                        ...item,
                        source: mockApiResponse.source
                    };
                });

                const resultadosFinales = await Promise.all(promesas);

                setListaRenderizada(resultadosFinales);
            } catch (error) {
                console.error("Error al consultar el endpoint:", error);
            } finally {
                setCargando(false);
            }
        }

        cargarPropiedades();
    }, []);


    return (
        // <div className="mi-componente">
        //     <h1>{titulo}</h1>
        //     {subtitulo && <p>{subtitulo}</p>}
        // </div>
        <div>
            <h2>Lista de Items</h2>
            <ul>
                {listaRenderizada.map((item) => (
                    <li key={item.id}>
                        <strong>{item.nombre}</strong> — Propiedad de la API: {item.source}
                    </li>
                ))}
            </ul>
        </div>
    );
};
