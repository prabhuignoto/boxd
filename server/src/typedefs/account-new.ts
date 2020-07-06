/* eslint-disable camelcase */
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Name {
  @Field()
  given_name!: string;

  @Field()
  surname!: string;

  @Field()
  familiar_name!: string;

  @Field()
  display_name!: string;

  @Field()
  abbreviated_name!: string;
}

@ObjectType()
export class Account {
  @Field()
  account_id!: string;

  @Field()
  name!: Name;

  @Field()
  email!: string;

  @Field()
  email_verified!: boolean;

  @Field()
  disabled!: boolean;

  @Field()
  is_teammate!: boolean;

  @Field()
  profile_photo_url!: string;
}

@ObjectType()
export class Allocation {
  @Field()
  allocated!: number;
}

@ObjectType()
export class SpaceUsage {
  @Field()
  used!: string;

  @Field()
  allocation!: Allocation;
}