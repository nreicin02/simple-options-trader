import { Request, Response, NextFunction } from 'express';
import UserService from '../services/UserService';

class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.register(req.body);
      return res.status(201).json({ user });
    } catch (err: any) {
      if (err.message === 'User already exists') {
        return res.status(400).json({ error: err.message });
      }
      if (err.message === 'Invalid input') {
        return res.status(400).json({ error: err.message });
      }
      return next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await UserService.login(email, password);
      return res.status(200).json(result);
    } catch (err: any) {
      if (err.message === 'Invalid input' || err.message === 'Invalid email or password') {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      return next(err);
    }
  }
}

export default UserController; 