// import { makeExecutableSchema } from 'graphql-tools';
// import AccountTypedef from './typedefs/account';
// import FolderTypedefs from './typedefs/folder';
// import Mutations from './typedefs/mutations';
// import QueriesTypedefs from './typedefs/queries';
// import SearchTypedefs from './typedefs/search';
// import Subscriptions from './typedefs/subscriptions';
// import UploadTypedefs from './typedefs/upload';

// import AccountResolver from './resolvers/account-new';
// import DownloadResolver from './resolvers/download';
// import FolderResolver from './resolvers/folder-new';
// import GetPreviewResolver from './resolvers/preview';
// import SearchResolver from './resolvers/search';
// import BulkResolver from './resolvers/bulk-new';
// import { buildTypeDefsAndResolvers } from 'type-graphql';

// export default makeExecutableSchema({
//   resolvers: [
//     AccountResolver,
//     FolderResolver,
//     SearchResolver,
//     // DownloadResolver,
//     GetPreviewResolver,
//     BulkResolver
//   ],
//   typeDefs: [
//     AccountTypedef,
//     ...FolderTypedefs,
//     QueriesTypedefs,
//     ...SearchTypedefs,
//     Mutations,
//     UploadTypedefs,
//     Subscriptions
//   ]
// });