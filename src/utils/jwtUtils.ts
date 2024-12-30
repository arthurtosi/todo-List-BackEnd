import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'defaultSecret';

export const createToken = (payload: object) => {
    return jwt.sign(payload, secret, { expiresIn: "1h"});
};

export const verifyToken = (token: string) => {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
};