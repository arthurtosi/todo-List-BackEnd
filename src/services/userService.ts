import pool from '../config/db';
import bcrypt from 'bcrypt';

/**
 * Busca o usuário pelo email.
 * @param email Email do usuário
 * @returns Retorna o id do usuário
 */
export const getUserByEmail = async (email: string) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    return user || null;
};

/**
 * Torna a senha criptografada.
 * @param password Senha a ser criptografada
 * @returns Retorna a senha criptografada
 */
export const hashPassword = (password: string) => {
    const saltRounds = 10; // Número de rounds para gerar o salt (que )
    return bcrypt.hash(password, saltRounds); // Retorna a senha criptografada
}

/**
 * Compara a senha com a senha criptografada.
 * @param password Senha a ser comparada
 * @param hash Senha criptografada
 * @returns Retorna true se a senha for igual, senão false
 */
export const comparePassword = (password: string, hash: string):Promise<Boolean> => {
    return bcrypt.compare(password, hash); // Retorna true se a senha for igual, senão false
}