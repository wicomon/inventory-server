import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';

@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Query(() => [Role], { name: 'roleFindAll' })
  findAll() {
    return this.roleService.findAll();
  }

  @Query(() => Role, { name: 'roleFindOne' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.roleService.findOne(id);
  }

  @Mutation(() => Role, { name: 'roleCreate' })
  createRole(@Args('createRoleInput') createRoleInput: CreateRoleInput) {
    return this.roleService.create(createRoleInput);
  }

  @Mutation(() => Role, { name: 'roleUpdate' })
  updateRole(@Args('updateRoleInput') updateRoleInput: UpdateRoleInput) {
    return this.roleService.update(updateRoleInput.id, updateRoleInput);
  }

  @Mutation(() => Role, { name: 'roleRemove' })
  removeRole(@Args('id', { type: () => String }) id: string) {
    return this.roleService.remove(id);
  }
}
