import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { Usuario } from '../entity/User';
import { validate } from 'class-validator';

const bcrypt = require('bcryptjs');

export class UserController {

    static getAll = async (req: Request, res: Response) => {
        const userRepository = getRepository(Usuario);
        let usuarios;

        try {
            usuarios = await userRepository.find();
        } catch (e) {
            res.status(404).json({ msg: "Algo ha ido mal" });
        }

        if (usuarios.length > 0) {
            res.send(usuarios);
        } else {
            res.status(404).json({ message: 'Not result' });
        }
    };

    static getById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userRepository = getRepository(Usuario);

        try {
            const user = await userRepository.findOneOrFail(id);
            res.send(user);
        } catch (e) {
            res.status(404).json({ message: 'Not result' });
        }
    };

    static newUser = async (req: Request, res: Response) => {
        const { nombres, apellidos, email, contrasena, celular, pin, fechanacimiento,  sexo, descripcion, paisresidencia, ciudadresidencia, imagen} = req.body;

        const user = new Usuario();

        user.nombres = nombres;
        user.apellidos = apellidos;
        user.email = email;
        user.contrasena = contrasena;
        user.celular = celular;
        user.pin = pin;
        user.fechanacimiento = fechanacimiento;
        user.sexo = sexo;
        user.descripcion = descripcion;
        user.paisresidencia = paisresidencia;
        user.ciudadresidencia = ciudadresidencia;
        user.imagen = imagen;

        //Validate
        const opcionesValidacion = { validationError: { target: false, value: false } };
        const errors = await validate(user, opcionesValidacion);
        if (errors.length > 0) {
            return res.json({ success: false });
        }

        //Hash Password
        const userRepository = getRepository(Usuario);
        console.log(userRepository);
        try {
            user.hashearPassw();
            await userRepository.save(user);
            return res.json({ success: true })
        } catch (e) {
            console.log(e);
            return res.json({ message: 'Email ya se encuentra registrado', success: false })
        }
    };

    static editUser = async (req: Request, res: Response) => {
        let user;
        const { id } = req.params;
        const { nombres, email } = req.body;

        const userRepository = getRepository(Usuario)

        try {
            user = await userRepository.findOneOrFail(id)
        } catch (e) {
            return res.status(404).json({ message: 'User not found' })
        }

        user.nombres = nombres;
        user.email = email;

        const opcionesValidacion = { validationError: { target: false, value: false } }; //para que no se envie info sensible
        const errors = await validate(user, opcionesValidacion);
        if (errors.length > 0) {
            return res.status(400).json(errors)
        }

        //Guardar usuario
        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).json({ message: 'Userio esta en uso' });
        }

        res.status(201).json({ message: 'User update' });
    }

    static deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userRepository = getRepository(Usuario);
        let user: Usuario;

        try {
            user = await userRepository.findOneOrFail(id);
        } catch (e) {
            return res.status(404).json({ message: 'User not found' })
        }

        userRepository.delete(id);
        res.status(201).json({ message: 'User eliminado' });

    };
}

export default UserController