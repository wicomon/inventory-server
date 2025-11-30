import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { LoginInput } from './dto/inputs/login.input';
import { PrismaService } from 'src/common/services/prisma.service';
import { CommonService } from 'src/common/services/common.service';
import * as encrypter from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(userId: string) {
    return this.jwtService.sign({ id: userId, msg: 'generated' });
  }

  async login(loginInput: LoginInput) {
    try {
      const { email, password } = loginInput;

      const existsUser = await this.prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (!existsUser)
        throw new BadRequestException('Email/password incorrectos');

      if (!encrypter.compareSync(password, existsUser.password))
        throw new BadRequestException('Email/password incorrectos');

      const token = this.getJwtToken(existsUser.id);

      return {
        token,
      };
    } catch (error) {
      this.commonService.handleErrors(error);
    }
  }

  async validateToken(token: string) {
    try {
      // console.log({token})
      const payload = this.jwtService.verify(token);
      // console.log({payload})
      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  async getUserInfo(token: string) {
    try {
      const { id } = this.jwtService.verify(token);
      const user = await this.userById(id);

      return user;
    } catch (error) {
      this.commonService.handleErrors(error);
    }
  }

  async userById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
            slug: true,
            canCreate: true,
            canRead: true,
            canUpdate: true,
            canDelete: true,
            menus: {
              select: {
                menu: {
                  select: {
                    id: true,
                    name: true,
                    code: true,
                    path: true,
                    order: true,
                    icon: true,
                    description: true,
                    subMenu: {
                      select: {
                        id: true,
                        name: true,
                        code: true,
                        path: true,
                        order: true,
                        icon: true,
                        description: true,
                        subMenu: {
                          select: {
                            id: true,
                            name: true,
                            code: true,
                            path: true,
                            order: true,
                            icon: true,
                            description: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    if (!user.isActive) throw new UnauthorizedException('User inactive');

    const formatedUser = {
      ...user,
      menus : user.role.menus
        .map((rm) => rm.menu)
        .sort((a, b) => a.order - b.order),
    }
    // console.log(formatedUser);
    return formatedUser;
  }
}
