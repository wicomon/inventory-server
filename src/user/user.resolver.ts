import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaSelect } from 'src/common/types';
import { SelectFields } from 'src/common/decorators/selected-fields.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'userFindAll' })
  findAll(
    @SelectFields() select: PrismaSelect
  ) {
    return this.userService.findAll(select);
  }

  @Query(() => User, { name: 'userById' })
  findOne(
    @Args('id', { type: () => String }) id: string,
    @SelectFields() select: PrismaSelect
  ) {
    return this.userService.findOne(id, select);
  }

  @Mutation(() => Boolean, { name: 'userCreate' })
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Mutation(() => Boolean, { name: 'userUpdate' })
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => Boolean, { name: 'userRemove' })
  removeUser(@Args('id', { type: () => String }) id: string) {
    return this.userService.remove(id);
  }
}
