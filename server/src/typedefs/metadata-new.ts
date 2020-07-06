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

  @Field()
  client_modified!: string;

  @Field()
  server_modified!: string;

  @Field()
  rev!: string;

  @Field()
  size!: number;

  @Field()
  path_lower!: string;

  @Field()
  path_display!: string;

  @Field()
  content_hash!: string;
}
