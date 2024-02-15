import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) return null;

    try {
      const jwtService = new JwtService();
      const decoded = jwtService.decode(token);
      const userId = decoded.sub;      
      return userId;
    } catch (error) {
      return null;
    }
  },
);