import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
class ContextCompany {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;
}

@ObjectType()
class ContextRole {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  slug: string;

  @Field(() => Boolean)
  canCreate: boolean;

  @Field(() => Boolean)
  canRead: boolean;

  @Field(() => Boolean)
  canUpdate: boolean;

  @Field(() => Boolean)
  canDelete: boolean;
}

@ObjectType()
export class ContextUser {
  @Field(() => String)
  id: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => ContextCompany)
  company: ContextCompany;

  @Field(() => ContextRole)
  role: ContextRole;
}
