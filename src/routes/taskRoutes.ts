import express from 'express';
import { createTask, getUserTasks, deleteTask, updateTask } from '../controllers/taskController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', createTask);
router.get('/:email', getUserTasks);
router.delete('/:id', deleteTask);
router.put('/:id', updateTask);

export default router;