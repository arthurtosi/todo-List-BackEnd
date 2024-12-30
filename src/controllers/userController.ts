import pool from "../config/db";
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getUserByEmail, hashPassword, comparePassword } from "../services/userService";
import { createToken } from "../utils/jwtUtils";

/**
 * Busca o usuário pelo email.
 * @param email Email do usuário
 * @returns Retorna o usuário ou null se não encontrado
 */
export const findUserByEmail = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    const { email } = req.params; // Email vindo da URL

    try {
        const user = await getUserByEmail(email);
        
        // Verifica se o usuário foi encontrado
        if (user === null) {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Retorna o usuário encontrado
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Retorna todos os usuários.
 * @returns Retorna todos os usuários
 */
export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Cria um novo usuário.
 * @param req.body Requisição contendo os dados do usuário
 * @returns Retorna o usuário criado
 */
export const createUser = async (
    req: Request,
    res:Response,
    next: NextFunction
): Promise<void> => {
    const { name, email, password } = req.body;
    const userId = uuidv4();

    try {
        const user = await getUserByEmail(email);
        if (user) {
            res.status(400).json({ error: 'Usuário já cadastrado' });
            return;
        }
        const hashedPassword = await hashPassword(password);
        console.log('hashedPassword:', hashedPassword);

        await pool.query(
            'INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)', 
            [userId, name, email, hashedPassword]
        );

        res.status(201).json({ id: userId, name, email, password });
    } catch (erro: any) {
        res.status(500).send(erro.message);
    }
}

/**
 * Executa o login
 * @param req.body Requisição contendo os dados do usuário
 * @returns Retorna o usuário logado
 */
export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await getUserByEmail(email);
        if (!user) {
            res.status(404).json({ error: 'Usuário não encontrado' });
            return;
        }

        const isPasswordCorrect = await comparePassword(password, user.password);
        if (!isPasswordCorrect) {
            res.status(401).json({ error: 'Senha incorreta' });
            return;
        }

        const userToken = createToken({ email: user.email, id: user.id });

        res.status(200).json({ message: 'Usuário logado com sucesso', token: userToken });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}