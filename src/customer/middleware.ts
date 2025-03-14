import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const token = req.headers['authorization']?.split(' ')[1]; // Getting token part after 'Bearer'

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      // Add type assertion to tell TypeScript that the decoded token is a JwtPayload
      const decoded = jwt.verify(token, 'your-secret-key') as jwt.JwtPayload;

      // Now TypeScript knows 'decoded' is a JwtPayload and has the 'id' property
      req.user = decoded; // Attach decoded user data to the request object
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  
}
