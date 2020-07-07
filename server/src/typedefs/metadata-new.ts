/* eslint-disable camelcase */
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Metadata {
  @Field()
  name!: string;

  @Field()
  tag!: string;

  @Field()
  id!: string;

  @Field({ nullable: true })
  client_modified!: string;

  @Field({ nullable: true })
  server_modified!: string;

  @Field({ nullable: true })
  rev!: string;

  @Field({ nullable: true })
  size!: number;

  @Field()
  path_lower!: string;

  @Field()
  path_display!: string;

  @Field({ nullable: true })
  content_hash!: string;
}
