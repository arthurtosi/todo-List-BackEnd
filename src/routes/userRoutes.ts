import { createUser, findUserByEmail, getAllUsers, loginUser } from '../controllers/userController';
import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/:email', authenticateToken, findUserByEmail);
router.get('/', authenticateToken, getAllUsers);
router.post('/register', createUser);
router.post('/login', loginUser);


export default router;