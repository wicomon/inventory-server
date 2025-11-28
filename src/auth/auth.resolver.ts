import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { AuthResponse } from './dto/response/auth-response.dto';
import { LoginInput } from './dto/inputs/login.input';
import { CurrentToken } from 'src/common/decorators';
import { ContextUser } from 'src/common/entities/ContextUser';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, {name: 'authLogin'})
  login(@Args('loginInput') loginInput: LoginInput){
    return this.authService.login(loginInput);
  }

  @Query(() => String, { name: 'authValidateToken' })
  validateToken(
    @CurrentToken() token: string,
  ) {
    return this.authService.validateToken(token);
  }

  @Query(() => ContextUser, { name: 'authUserInfo' })
  getUser(
    @CurrentToken() token: string
  ){
    return this.authService.getUserInfo(token);
  }

  // @Query(() => [Auth], { name: 'authGetUser' })
  // findAll() {
  //   return this.authService.findAll();
  // }
}
