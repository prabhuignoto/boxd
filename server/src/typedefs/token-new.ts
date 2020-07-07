import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export default class RevokeToken {
  @Field()
  success!: boolean;
}
