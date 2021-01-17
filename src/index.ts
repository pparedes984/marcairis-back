import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import { Usuario } from "./entity/User";

import {Request, Response} from "express";
import * as cors from 'cors';
import * as helmet from 'helmet';
import routes from './Rutas';

const PORT = process.env.PORT || 3000;

createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "1234",
    database: "db_agenda",
    entities: [
        Usuario
    ]
}).then(async () => {

    // express app
    const app = express();
    //Middlewares
    app.use(cors());
    app.use(helmet());

    app.use(express.json());

    //Rutas
    app.use('/', routes);

    //start
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
    
}).catch(error => console.log(error));
