import { Dropbox, files } from "dropbox";
import { createLogger, transports } from "winston";
const errorLogger = createLogger({
  level: "error",
  transports: [new transports.Console()]
});

export default {
  Query: {
    search: async (obj: any, args: any, context: any, info: any) => {
      try {
        const folderResult:files.SearchResult = await new Dropbox({
          accessToken: context.session.access_token,
          clientId: process.env.CLIENT_ID
        }).filesSearch({
          path: '',
          query: args.query,
          max_results: 50,
        });

        return {
          matches: folderResult.matches.map(x => {
            return Object.assign({}, x, {
              metadata: Object.assign({}, x.metadata, {
                tag: x.metadata[".tag"]
              })
            })
          }),
          more: folderResult.more,
          start: folderResult.start
        }
      } catch (error) {
        errorLogger.log(error);
        return {}
      }
    }
  }
}