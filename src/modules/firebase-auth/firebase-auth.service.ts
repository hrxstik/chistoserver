import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: typeof admin,
  ) {}

  async verifyAppCheckToken(appCheckToken: string) {
    if (!appCheckToken) {
      throw new UnauthorizedException('App Check token missing');
    }

    const projectNumber = process.env.FIREBASE_PROJECT_NUMBER;
    const url = `https://firebaseappcheck.googleapis.com/v1/projects/${projectNumber}/apps/-/appCheck:verifyToken`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: appCheckToken }),
    });

    if (!response.ok) {
      throw new UnauthorizedException('Invalid App Check token');
    }

    const data = await response.json();
    return data;
  }
}
