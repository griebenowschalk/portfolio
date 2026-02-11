import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

class AuthController {
  /**
   * POST /api/v1/auth/register
   * Register a new user
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          error: 'User already exists',
        });

        return;
      }

      const user = await User.create({ name, email, password });
      const token = generateAccessToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });
      const refreshToken = generateRefreshToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/login
   * Login a user
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });

        return;
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });

        return;
      }

      const token = generateAccessToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });
      const refreshToken = generateRefreshToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/auth/me
   * Get the current user
   */
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findById(req.user?.userId);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });

        return;
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/logout
   * Logout a user
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findById(req.user?.userId);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });

        return;
      }

      await user.updateOne({ refreshToken: null });

      res.status(200).json({
        success: true,
        data: { message: 'Logged out successfully' },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
