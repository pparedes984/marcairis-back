import {Router} from 'express';
import AuthController from '../Controladores/AuthControler';
import UserController from '../Controladores/UserControler';
import { checkToken } from './../Middleware/jwt';

const router = Router();

//login
router.post('/login', AuthController.login);
router.post('/loginpin', AuthController.loginPin);
router.post('/register', UserController.newUser );
router.post('/cambio-contrasena', [checkToken], AuthController.cambiarPassword);
export default router;