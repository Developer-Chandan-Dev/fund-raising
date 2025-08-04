// middleware/validateImage.ts
import { Request, Response, NextFunction } from 'express';

export const validateImage = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) return next();
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ message: 'Only JPEG, PNG, JPG, and WebP images are allowed' });
  }

  if (req.file.size > maxSize) {
    return res.status(400).json({ message: 'Image size must be less than 5MB' });
  }

  next();
};