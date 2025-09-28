import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AppTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const appToken = request.headers['x-app-token'];
    if (appToken !== process.env.APP_SECRET_TOKEN) {
      throw new UnauthorizedException('Invalid app token');
    }
    return true;
  }
}
