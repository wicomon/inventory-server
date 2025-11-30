import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginInput } from './dto/inputs/login.input';
import { PrismaService } from 'src/common/services/prisma.service';
import { CommonService } from 'src/common/services/common.service';
import * as encrypter from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordInput } from './dto/inputs/change-password.input';

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

  async changePassword(token: string, changePasswordInput: ChangePasswordInput) {
    try {
      const { id } = this.jwtService.verify(token);
      const userId = id;
      const { currentPassword, newPassword } = changePasswordInput;
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) throw new NotFoundException('Usuario no encontrado');

      if (!encrypter.compareSync(currentPassword, user.password))
        throw new BadRequestException('La contraseña actual es incorrecta');

      const hashedPassword = encrypter.hashSync(newPassword, 10);

      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return true;
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
                    type: true,
                    position: true,
                    path: true,
                    order: true,
                    icon: true,
                    description: true,
                    subMenu: {
                      select: {
                        id: true,
                        name: true,
                        code: true,
                        type: true,
                        position: true,
                        path: true,
                        order: true,
                        icon: true,
                        description: true,
                        subMenu: {
                          select: {
                            id: true,
                            name: true,
                            code: true,
                            type: true,
                            position: true,
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
