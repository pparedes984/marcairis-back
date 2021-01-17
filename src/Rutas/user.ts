import { Router } from 'express';
import { UserController } from '../Controladores/UserControler';
import { checkToken } from './../Middleware/jwt';

const router = Router();

// Get all users
router.get('/', [checkToken], UserController.getAll);

//Get one user
router.get('/:id', [checkToken], UserController.getById);

//edit
router.patch('/:id', [checkToken], UserController.editUser);

// //delete
// router.patch('/:id', [checkToken], UserController.deleteUser);

export default router;
