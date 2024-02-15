import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';
  import { EnvironmentVariables } from 'src/enviroment-variables';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(
      private jwtService: JwtService,
      private config: ConfigService<EnvironmentVariables, true>,
    ) {}
  
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization?.split(' ')[1];
  
      if (!token) throw new UnauthorizedException('Missing token');
  
      try {
        const secretKey = this.config.get('JWT_SECRET', { infer: true });
        const decoded = this.jwtService.verify(token, { secret: secretKey });
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }
  