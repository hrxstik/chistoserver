import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseAuthService } from '../modules/firebase-auth/firebase-auth.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly firebaseAuthService: FirebaseAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const appCheckToken = request.headers['x-firebase-appcheck'] as string;
    if (!appCheckToken)
      throw new UnauthorizedException('X-Firebase-AppCheck header missing');

    await this.firebaseAuthService.verifyAppCheckToken(appCheckToken);
    return true;
  }
}
