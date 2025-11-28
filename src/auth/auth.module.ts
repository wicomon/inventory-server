import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from 'src/common/common.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  providers: [AuthResolver, AuthService, JwtStrategy, RefreshTokenStrategy],
  // exports: [PassportModule, JwtStrategy, JwtModule],
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '4h',
        },
      }),
    }),
    CommonModule,
  ],
})
export class AuthModule {}
