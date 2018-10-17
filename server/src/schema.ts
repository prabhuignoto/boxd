import { makeExecutableSchema } from "graphql-tools";
import AccountTypedef from "./typedefs/account";
import FolderTypedefs from "./typedefs/folder";
import QueriesTypedefs from "./typedefs/queries";
import SearchTypedefs from "./typedefs/search";
import Mutations from "./typedefs/mutations";

import AccountResolver from "./resolvers/account";
import FolderResolver from "./resolvers/folder";
import SearchResolver from "./resolvers/search";
import DownloadResolver from "./resolvers/download";
import GetPreviewResolver from "./resolvers/preview";

export default makeExecutableSchema({
  typeDefs: [
    AccountTypedef,
    ...FolderTypedefs,
    QueriesTypedefs,
    ...SearchTypedefs,
    Mutations
  ],
  resolvers: [
    AccountResolver,
    FolderResolver,
    SearchResolver,
    DownloadResolver,
    GetPreviewResolver,
  ]
});
