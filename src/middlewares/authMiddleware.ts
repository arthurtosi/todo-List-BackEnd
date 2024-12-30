import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils';

export const authenticateToken = (
    req: Request, 
    res: Response, 
    next: NextFunction
):void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ error: 'Token de autenticação não fornecido' });
        return;
    }

    const token = authHeader.split(' ')[1]; // Pega o token após "Bearer "
    console.log(token);

    if (!verifyToken(token)) {
        res.status(401).send({error: "Unauthorized"});
        return;
    }

    next();
};