/* eslint-disable camelcase */
import { ArgsType, Field, ObjectType } from 'type-graphql';
import { Metadata } from './metadata-new';

@ObjectType()
export class Folder {
  @Field(returns => [Metadata])
  entries!: Metadata[];

  @Field()
  hasMore!: boolean;

  @Field()
  cursor!: string;
}

@ObjectType()
export class EntryMetadata {
  @Field()
  tag!: string;

  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  path_lower!: string;

  @Field()
  path_display!: string;
}

@ObjectType()
export class Entry {
  @Field()
  tag!: string;

  @Field(returns => EntryMetadata)
  metadata!: EntryMetadata
}

ObjectType();
export class ResxMessage {
  @Field()
  success!: Boolean;

  @Field()
  name!: String;
}

ObjectType();
export class FolderAddedMessage {
  @Field()
  success!: boolean;

  @Field()
  name!: string;

  @Field()
  path!: string;

  @Field()
  uiJobId!: String;
}

@ObjectType()
export class BatchWorkMessage {
  @Field()
  job_id!: string;

  @Field()
  status!: string;

  @Field()
  error!: string;

  @Field(returns => [Entry])
  entries!: Entry[]

  @Field()
  job_type!: string;

  @Field()
  uiJobId!: string;
}

@ArgsType()
export class RelocationEntry {
  @Field()
  fromPath!: string;

  @Field()
  toPath!: string;

  @Field()
  id!: string;
}

@ArgsType()
export class RelocationOptions {
  @Field(returns => [RelocationEntry])
  entries!: RelocationEntry[];

  @Field()
  autorename!: boolean;

  @Field()
  uiJobId!: string;
}
