import { getRepository } from 'typeorm';
import {Request, Response} from 'express';
import { Usuario } from '../entity/User';
import config from '../config/config';
import * as jwt from 'jsonwebtoken';
import { validate } from 'class-validator';

class AuthController {
    static login = async (req: Request, res: Response) => {
        const {email, contrasena} = req.body;

        if( !(email && contrasena)) {
            return res.json({message: 'Username & Password are required'});
        }

        const userRepository = getRepository(Usuario);
        let user: Usuario;

        try{
            user = await userRepository.findOneOrFail({ where:{email: email}});       
        }catch(e){
            return res.json({msg: 'Email o contraseña incorrecta',success: false});
        }

        //Check
        if (user.checkPassw(contrasena)) {
            const token = jwt.sign({userId: user.idUsuario, username: user.nombres}, config.jwtSecret, 
                {expiresIn: '1h'});

            return res.status(200).json({
                success: true,
                token: `${token}`,
                msg: "Ingreso exitoso",
                id: user.idUsuario,
                nombre: user.nombres,
                correo: user.email,
                phone: user.celular
            });
            // const payload = {
            //     idUsuario: user.idUsuario,
            //     nombres: user.nombres,
            //     apellidos: user.apellidos,
            //     email: user.email,
            //     celular: user.celular
            // }
            // jwt.sign(payload, key,
            //     (err, token) => {
            //     return res.status(200).json({
            //         success: true,
            //         token: `${token}`,
            //         user: user,
            //         msg: "Ingreso exitoso"
            //     });
            // });
        } else {
            return res.json({
                msg: "Contrasena incorrecta.",
                success: false
            });
        }
        
    };

    static cambiarPassword = async (req: Request, res: Response) => {
        const {userId} = res.locals.jwtPayload;
        const {oldPassword, newPassword} = req.body;

        if(!(oldPassword && newPassword)){
            res.status(400).json( {msg: 'Antigua contraseña y la nueva contraseña son requeridas'});
        }

        const userRepository = getRepository(Usuario);
        let user: Usuario;

        try {
            user = await userRepository.findOneOrFail(userId);
        }
        catch(e){
            res.status(400).json({ msg: 'Algo ha salido mal'});
        }

        if(!user.checkPassw(oldPassword)){
            return res.status(401).json({message: 'Contraseña incorrecta, vuelva a ingresar'});
        }
        user.contrasena = newPassword;
        const opcionesValidacion = {validationError: {target: false, value: false} };
        const errors = await validate(user, opcionesValidacion);
        
        if(errors.length > 0){
            return res.status(400).json(errors);
        }

        //hashear contraseña
        user.hashearPassw();
        userRepository.save(user);

        res.json({msg: 'Contraseña cambiada existosamente!'});
    }


    static loginPin = async (req: Request, res: Response) => {
        const {email, pin} = req.body;

        if( !(email && pin)) {
            return res.json({message: 'Username & pin are required'});
        }

        const userRepository = getRepository(Usuario);
        let user: Usuario;

        try{
            user = await userRepository.findOneOrFail({ where:{email: email}});       
        }catch(e){
            return res.json({msg: 'Email o contraseña incorrecta',success: false});
        }

        //Check
        if (user.checkPin(pin)) {
            const token = jwt.sign({userId: user.idUsuario, username: user.nombres}, config.jwtSecret, 
                {expiresIn: '1h'});

            return res.status(200).json({
                success: true,
                token: `${token}`,
                msg: "Ingreso exitoso",
                id: user.idUsuario,
                nombre: user.nombres,
                correo: user.email,
                phone: user.celular
            });
            
        } else {
            return res.json({
                msg: "Pin incorrecto.",
                success: false
            });
        }
        
    };
}

export default AuthController;