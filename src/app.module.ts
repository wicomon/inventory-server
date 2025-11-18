import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { CompanyModule } from './company/company.module';
import { MenuModule } from './menu/menu.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // load: [EnvVaribales],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // rootValue: '/',
      path: '/gql',
      plugins: [
        process.env.NODE_ENV === 'development'
          ? ApolloServerPluginLandingPageLocalDefault()
          : ApolloServerPluginLandingPageProductionDefault(),
      ],
      // formatError: (err) => ({
      //   message: err.message,
      //   // status: err.extensions.code,
      //   // extensions: err.extensions,
      //   error: err.extensions.originalError['error'],
      //   code: err.extensions.originalError['statusCode'],
      //   originalMessage: err.extensions.originalError['message'],
      // }),
    }),
    UserModule,
    CommonModule,
    CompanyModule,
    MenuModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
