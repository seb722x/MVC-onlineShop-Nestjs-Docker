import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['token']; // Obtén el token de la cookie

    if (token) {
      request.headers['authorization'] = `Bearer ${token}`; // Agrega el token al encabezado de autorización
    }

    return next.handle();
  }
}
