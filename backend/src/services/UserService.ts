import { prisma } from '../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

class UserService {
  static async register(userData: any) {
    const parsed = registerSchema.safeParse(userData);
    if (!parsed.success) {
      throw new Error('Invalid input');
    }
    const { email, password, firstName, lastName } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error('User already exists');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        experienceLevel: 'beginner',
        emailVerified: false,
        twoFactorEnabled: false,
      },
    });
    // Remove passwordHash from returned user
    const userSafe = { ...user } as any;
    delete userSafe.passwordHash;
    return userSafe;
  }

  static async login(email: string, password: string) {
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      throw new Error('Invalid input');
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new Error('Invalid email or password');
    }
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env['JWT_SECRET'] || 'changeme',
      { expiresIn: '7d' }
    );
    return { token };
  }
}

export default UserService; 