import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { PrismaSelect } from 'src/common/types';
import { SelectFields } from 'src/common/decorators';

@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Query(() => [Role], { name: 'roleFindAll' })
  findAll(@SelectFields() select: PrismaSelect) {
    return this.roleService.findAll(select);
  }

  @Query(() => Role, { name: 'roleFindOne' })
  findOne(
    @Args('id', { type: () => String }) id: string,
    @SelectFields() select: PrismaSelect,
  ) {
    return this.roleService.findOne(id, select);
  }

  @Mutation(() => Boolean, { name: 'roleCreate' })
  createRole(@Args('createRoleInput') createRoleInput: CreateRoleInput) {
    return this.roleService.create(createRoleInput);
  }

  @Mutation(() => Boolean, { name: 'roleUpdate' })
  updateRole(@Args('updateRoleInput') updateRoleInput: UpdateRoleInput) {
    return this.roleService.update(updateRoleInput.id, updateRoleInput);
  }

  @Mutation(() => Boolean, { name: 'roleRemove' })
  removeRole(@Args('id', { type: () => String }) id: string) {
    return this.roleService.remove(id);
  }
}
