import { InputType, Field, Float } from "type-graphql";

@InputType()
export class Entry {
  @Field()
  fromPath!: string;

  @Field()
  toPath!: string;

  @Field({ nullable: true })
  id?: string;
}

@InputType()
export class DeleteBulkArgs {
  @Field(returns => [String])
  paths!: string[];

  @Field()
  uiJobId!: string;
}

@InputType()
export class RelocationBulkArgs {
  @Field({ nullable: true })
  autorename?: boolean;

  @Field()
  uiJobId!: string;

  @Field(returns => [Entry])
  entries!: Entry[]
}

@InputType()
export class Context {
  session!: {
    // eslint-disable-next-line camelcase
    access_token: string
  }
}

@InputType()
export class FilesRelocationArg {
  @Field()
  fromPath!: string;

  @Field()
  toPath!: string;

  @Field({ nullable: true })
  autorename?: boolean;

  @Field()
  uiJobId!: string;
}

@InputType()
export class CreateFolderArg {
  @Field()
  path!: string;

  @Field({ nullable: true })
  autorename?: boolean;

  @Field()
  uiJobId!: string;

  @Field()
  name!: string;
}

@InputType()
export class DeleteFolderArg {
  @Field()
  path!: string;
}

@InputType()
export class ListFilesArg {
  @Field(returns => Float)
  limit!: number;

  @Field()
  path!: string;

  @Field()
  cursor!: string;
}