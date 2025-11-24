import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';

@Resolver(() => Company)
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  @Query(() => [Company], { name: 'companyFindAll' })
  findAll() {
    return this.companyService.findAll();
  }

  @Query(() => Company, { name: 'companyFindOne' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.companyService.findOne(id);
  }

  @Mutation(() => Company, { name: 'companyCreate' })
  createCompany(
    @Args('createCompanyInput') createCompanyInput: CreateCompanyInput,
  ) {
    return this.companyService.create(createCompanyInput);
  }

  @Mutation(() => Company, { name: 'companyUpdate' })
  updateCompany(
    @Args('updateCompanyInput') updateCompanyInput: UpdateCompanyInput,
  ) {
    return this.companyService.update(
      updateCompanyInput.id,
      updateCompanyInput,
    );
  }

  @Mutation(() => Company, { name: 'companyRemove' })
  removeCompany(@Args('id', { type: () => String }) id: string) {
    return this.companyService.remove(id);
  }
}
