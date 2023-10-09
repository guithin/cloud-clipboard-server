import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import User from 'src/db/models/User';

export const fetchUserMiddleware: RequestHandler = (req, res, next) => {
  if (req.path.startsWith('/api/auth/')) {
    return next();
  }

  const token = req.headers.authorization;
  if (typeof token !== 'string') {
    return res.status(401).send('Unauthorized');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send('Unauthorized');
    }
    if (typeof decoded === 'string' || typeof decoded === 'undefined') {
      return res.status(401).send('Unauthorized');
    }
    if (typeof decoded.id !== 'number' || typeof decoded.userId !== 'string' || typeof decoded.name !== 'string') {
      return res.status(401).send('Unauthorized');
    }
    req.user = {
      id: decoded.id,
      userId: decoded.userId,
      name: decoded.name,
    };
    next();
  });
};

export const loginUser = (user: User) => {
  const userInfo = {
    id: user.id,
    userId: user.userId,
    name: user.name,
  };
  const token = jwt.sign(userInfo, process.env.JWT_SECRET, { algorithm: 'HS256' });
  return token;
};
