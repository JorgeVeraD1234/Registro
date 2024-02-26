import { Server, ic } from 'azle';
import cors from "cors";
import express from 'express';

type TRegistros = {
    ID: number;
    author: string;
    character: string;
    name: string;
    Information: string
    content: string;
}

let registros: TRegistros[] = [
    {
        ID: 8,
        author: "Jorge",
        character: "Institucional",
        name: "Realizacion del certificado",
        Information: "Desconocida",
        content: "Desconocido",
    }
]

export default Server(() => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    // app.use((req, res, next) => {
    //     if (ic.caller().isAnonymous()) {
    //         res.status(401);
    //         res.send();
    //     } else {
    //         next();
    //     }
    // });

    app.post('/create', (req, res) => {
        const registro = registros.find((registro) => registro.ID === parseInt(req.body.ID));
        if (registro) {
            res.status(400).json({ msg: "El ID ya esta en uso.", data: registro });
            return;
        }

        req.body.ID = registros[registros.length - 1].ID + 1;

        registros.push(req.body);
        res.status(200).json({ msg: "El registro se completo exitosamente" });
    });

    app.get('/get', (req, res) => {
        res.status(200).json({ msg: "Registros exitosos.", data: registros });
    });

    app.put('/update/:ID', (req, res) => {
        const registro = registros.find((registro) => registro.ID === parseInt(req.params.ID))
        if (!registro) {
            res.status(404).json({ msg: "El ID no existe." });
            return;
        }
        req.body.ID = registros[registros.length - 1].ID + 1

        const URegistro = { ...registro, ...req.body };


        registros = registros.map((r) => r.ID === URegistro.ID ? URegistro : r);

        res.status(200).json({ msg: "El registro se actualizo" })
    });

    app.delete('/delete/:ID', (req, res) => {
        registros = registros.filter((r) => r.ID !== parseInt(req.params.ID));

        res.status(200).json({ msg: "El registro se elimino", data: registros })
    });




    app.post('/test', (req, res) => {
        res.json(req.body);
    });

    app.get('/whoami', (req, res) => {
        res.statusCode = 200;
        res.send(ic.caller());
    });

    app.get('/health', (req, res) => {
        res.send().statusCode = 204;
    });

    return app.listen();
});
