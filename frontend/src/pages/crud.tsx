"use client";
import { useEffect, useState } from 'react';

import axios from 'axios';
import { text } from 'stream/consumers';

type TRegistros = {
    ID: number;
    author: string;
    character: string;
    name: string;
    Information: string;
    content: string;
}

type TRes = {
    msg: string;
    data?: any
}

const headers = {
    headers: {
        "Content-Type": "application/json",
    }
}

export default function CrudRegistro() {
    useEffect(() => {
        getRegistros();
    }, []);

    const [registros, setRegistros] = useState<TRegistros[]>([]);
    const [registro, setRegistro] = useState<TRegistros>({
        ID: 0,
        author: "",
        character: "",
        name: "",
        Information: "",
        content: ""
    });

    const [isEditable, setIsEditable] = useState(false)

    const onChange = (r: any) => {
        const data: any = registro;
        data[r.target.name] = r.target.value;
        setRegistro(data);
    }

    const getRegistros = async () => {
        try {
            const response = await axios.get<TRes>(`${process.env.NEXT_PUBLIC_API_REST_URL}/get`);

            if (response.data.data) {
                setRegistros(response.data.data);
            }

        } catch (error) {
            alert('Hubo un error al realizar la peticion: ${error}');
        }
    }

    const createRegistros = async () => {
        try {
            await axios.post<TRes>(`${process.env.NEXT_PUBLIC_API_REST_URL}/create`, registro, headers);

            getRegistros();

        } catch (error) {
            alert('Hubo un error al realizar la peticion: ${error}');
        }
    }


    const updateRegistro = async (ID: number) => {
        try {
            await axios.put<TRes>(`${process.env.NEXT_PUBLIC_API_REST_URL}/update/${ID}`, registro, headers);

            getRegistros();
            setIsEditable(false);
        } catch (error) {
            alert('Hubo un error al realizar la peticion: ${error}');
        }
    }

    const deleteRegistro = async (ID: number) => {
        try {
            await axios.delete<TRes>(`${process.env.NEXT_PUBLIC_API_REST_URL}/delete/${ID}`,
            );
            getRegistros();
        } catch (error) {
            alert('Hubo un error al realizar la peticion: ${error}');
        }
    }

    const preUpdate = (r: TRegistros) => {
        setRegistro(r);
        setIsEditable(true);
    }


    return (
        <div>
            <h1>Crud</h1>
            <div>
                <label htmlFor="author">Ingresa tu nombre:</label><br />
                <input
                    type="type"
                    onChange={(r) => onChange(r)}
                    name="author"
                /><br />
                <label htmlFor="character">Ingresa tu nombre:</label><br />
                <input
                    type="type"
                    onChange={(r) => onChange(r)}
                    name="character"
                /><br />
                <label htmlFor="name">Ingresa el nombre de tu registro:</label><br />
                <input
                    type="type"
                    onChange={(r) => onChange(r)}
                    name="name"
                /><br />
                <label htmlFor="Information">Ingresa la informacion:</label><br />
                <input
                    type="type"
                    onChange={(r) => onChange(r)}
                    name="Infotmation"
                /><br />
                <label htmlFor="content">Ingresa el contenido:</label><br />
                <input
                    type="type"
                    onChange={(r) => onChange(r)}
                    name="content"
                /><br />

            </div>
            <button onClick={createRegistros}>Añadir registro</button>
            <table>
                <tr>
                    <th>Autor</th>
                    <th>Caracter</th>
                    <th>Nombre</th>
                    <th>Informacion</th>
                    <th>Contenido</th>
                    <th>Opciones</th>
                </tr>
                {registros.map((registro, index) => (
                    <tr key={index}>
                        <td>{registro.author}</td>
                        <td>{registro.character}</td>
                        <td>{registro.name}</td>
                        <td>{registro.Information}</td>
                        <td>{registro.content}</td>
                        <td>
                            <button onClick={() => deleteRegistro(registro.ID ?? 0)}>Delete</button>
                        </td>
                        <td>
                            <button onClick={() => preUpdate(registro)}>update</button>
                        </td>
                    </tr>
                ))}
            </table>

            {
                isEditable && (
                    <div>
                        <label htmlFor="author">Ingresa tu nombre:</label><br />
                        <input
                            type="type"
                            onChange={(r) => onChange(r)}
                            defaultValue={registro.author}
                            name="author"
                        />
                        <label htmlFor="character">Ingresa tu nombre:</label><br />
                        <input
                            type="type"
                            onChange={(r) => onChange(r)}
                            defaultValue={registro.character}
                            name="character"
                        />
                        <label htmlFor="name">Ingresa el nombre de tu registro:</label><br />
                        <input
                            type="type"
                            onChange={(r) => onChange(r)}
                            defaultValue={registro.name}
                            name="name"
                        />
                        <label htmlFor="information">Ingresa la informacion:</label><br />
                        <input
                            type="type"
                            onChange={(r) => onChange(r)}
                            defaultValue={registro.Information}
                            name="Infotmation"
                        />
                        <label htmlFor="content">Ingresa el contenido:</label><br />
                        <input
                            type="type"
                            onChange={(r) => onChange(r)}
                            defaultValue={registro.content}
                            name="contenido"
                        /><br />
                        <button onClick={() => updateRegistro(registro.ID ?? 0)}>Guardar</button>


                    </div>
                )
            }
        </div>
    )
}