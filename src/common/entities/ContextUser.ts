import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ContextUser {
  @Field(() => Int)
  idUser: number;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String)
  nickName: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => String, {nullable: true})
  refreshToken?: string;

  @Field(() => Int)
  idCompany: number;

  @Field(() => [String])
  roles: string[];
}
