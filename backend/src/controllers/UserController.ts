import { Request, Response, NextFunction } from 'express';
import UserService from '../services/UserService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.register(req.body);
      return res.status(201).json({ user });
    } catch (err: any) {
      return next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await UserService.login(email, password);
      return res.status(200).json(result);
    } catch (err: any) {
      return next(err);
    }
  }

  static async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          experienceLevel: true,
          createdAt: true,
          updatedAt: true,
          emailVerified: true,
          twoFactorEnabled: true
        }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const { firstName, lastName, experienceLevel } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          experienceLevel
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          experienceLevel: true,
          createdAt: true,
          updatedAt: true,
          emailVerified: true,
          twoFactorEnabled: true
        }
      });

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;