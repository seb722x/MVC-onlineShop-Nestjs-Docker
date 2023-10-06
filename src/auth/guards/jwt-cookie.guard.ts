import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtCookieGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['token']; // Leer el token de la cookie

    if (!token) {
      return false; // Si no se encuentra el token, la solicitud no está autorizada
    }

    try {
      const decodedToken = this.jwtService.verify(token);
      request.user = decodedToken; // Establecer el usuario en la solicitud
      return true;
    } catch (error) {
      return false; // Si el token no es válido, la solicitud no está autorizada
    }
  }
}