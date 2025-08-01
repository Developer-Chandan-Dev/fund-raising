import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';
import User from '../models/User';

// Extend Request interface
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const admin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};