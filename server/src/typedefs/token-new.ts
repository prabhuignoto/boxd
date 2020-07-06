import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export default class RevoeToken {
  @Field()
  success!: boolean;
}
