import pool from "../config/db";
import { NextFunction, Request, Response } from 'express';
import { getUserByEmail } from "../services/userService";

/**
 * Criar uma nova tarefa.
 * @param req.body Requisição contendo os dados da tarefa
 * @returns Retorna a tarefa criada
 */
export const createTask = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { title, description, status, userId } = req.body;
    console.log(req.body);
    console.log(userId);
    // const email = req.params.email;
    // console.log(email);
    const user = await getUserByEmail(userId);
    const taskStatus = status || 'pendente';

    try {
        const result = await pool.query(
            'INSERT INTO tasks (title, description, user_id, status) VALUES ($1, $2, $3, $4) RETURNING id',
            [title, description, user.id, taskStatus]
        );
        
        // O ID gerado pelo banco é retornado no `result.rows[0].id`
        const taskId = result.rows[0].id;

        res.status(201).json({ id: taskId, title, description, userId: user.id });
    } catch (erro: any) {
        res.status(500).send(erro.message);
    }
}

/**
 * Retorna todas as tarefas de um usuário.
 * @param req.params.email Email do usuário
 * @returns Retorna as tarefas do usuário
 */
export const getUserTasks = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const email = req.params.email;
    const user = await getUserByEmail(email);

    try {
        const { rows } = await pool.query(
            'SELECT * FROM tasks WHERE user_id = $1',
            [user.id]
        );
        res.json(rows);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Deleta a tarefa de um usuário.
 * @param id Id da tarefa
 */
export const deleteTask = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const taskId = req.params.id;
    console.log(taskId);

    try {
        // Verifica se a tarefa pertence ao usuário autenticado
        const result = await pool.query(
            'SELECT * FROM tasks WHERE id = $1',
            [taskId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        // Exclui a tarefa
        await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);

        res.status(200).json({ message: 'Tarefa deletada com sucesso' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Edita a tarefa de um usuário.
 * @param req.body Requisição contendo os dados da tarefa
 * @returns Retorna a tarefa editada
 */
export const updateTask = async (
    req: Request, 
    res: Response,
    next: NextFunction
):Promise<void> => {
    const  taskId = req.params.id; // ID da tarefa
    const { title, description, status } = req.body; // Campos a atualizar

    try {
        // Verifica se a tarefa pertence ao usuário
        const taskExists = await pool.query(
            'SELECT * FROM tasks WHERE id = $1',
            [taskId]
        );

        if (taskExists.rows.length === 0) {
            res.status(404).json({ error: 'Tarefa não encontrada' });
            return;
        }

        // Constrói dinamicamente os campos e valores
        const fields: string[] = [];
        const values: (string | undefined)[] = [];

        if (title) {
            fields.push('title = $' + (fields.length + 1));
            values.push(title);
        }
        if (description) {
            fields.push('description = $' + (fields.length + 1));
            values.push(description);
        }
        if (status) {
            fields.push('status = $' + (fields.length + 1));
            values.push(status);
        }

        if (fields.length === 0) {
            res.status(400).json({ error: 'Nenhum campo para atualizar' });
            return;
        }

        // Monta a query final
        const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${fields.length + 1} `;
        values.push(taskId);

        // Executa a query
        await pool.query(query, values);

        const updatedTask = await pool.query('SELECT * FROM tasks WHERE id = $1', [taskId]); // Busca a tarefa ATUALIZADA
        // Se nao tivesse essa linha e usassemos a constante taskExists, o status da tarefa nao imprimiria atualizada

        await res.status(200).json({ message: 'Tarefa atualizada com sucesso', task: updatedTask.rows[0] });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
