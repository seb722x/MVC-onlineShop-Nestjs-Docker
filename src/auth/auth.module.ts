import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AdminUsersController } from './admin.auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtTokenInterceptor } from './interceptors/jwt.interceptor';

@Module({
  controllers: [AuthController,AdminUsersController],
  providers: [AuthService, JwtStrategy ,{
    provide: APP_INTERCEPTOR,
    useClass: JwtTokenInterceptor,
  },],
  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([ User ]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) => {
        // console.log('JWT Secret', configService.get('JWT_SECRET') )
        // console.log('JWT SECRET', process.env.JWT_SECRET)
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn:'2h'
          }
        }
      }
    })
    // JwtModule.register({
      // secret: process.env.JWT_SECRET,
      // signOptions: {
      //   expiresIn:'2h'
      // }
    // })

  ],
  exports: [ TypeOrmModule, JwtStrategy, PassportModule, JwtModule, AuthService ]
})
export class AuthModule {}
