import User from 'src/db/models/User';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
