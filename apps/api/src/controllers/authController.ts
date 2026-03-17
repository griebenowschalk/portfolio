import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';

class AuthController {
  /**
   * POST /api/v1/auth/register (admin only)
   * Create a new CMS user. Only admins can register; new user logs in via /login.
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

      res.status(201).json({
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
          accessToken: token,
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
   * POST /api/v1/auth/refresh
   * Exchange a valid refresh token for a new access token
   */
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res
          .status(400)
          .json({ success: false, error: 'Refresh token required' });
        return;
      }

      let payload: ReturnType<typeof verifyRefreshToken>;
      try {
        payload = verifyRefreshToken(refreshToken);
      } catch {
        res
          .status(401)
          .json({ success: false, error: 'Invalid or expired refresh token' });
        return;
      }

      const user = await User.findById(payload.userId);
      if (!user || !user.isActive) {
        res
          .status(401)
          .json({ success: false, error: 'User not found or inactive' });
        return;
      }

      const accessToken = generateAccessToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      res.status(200).json({ success: true, data: { accessToken } });
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
