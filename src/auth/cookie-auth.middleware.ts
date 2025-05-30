import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CookieAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.token; // Récupère le token du cookie
    
    if (!token) {
      throw new UnauthorizedException('No auth token');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret');
      (req as any).user = decoded;
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}