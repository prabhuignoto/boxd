# Boxy

<!-- [![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads Stats][npm-downloads]][npm-url] -->

Boxy is a modern web client for Dropbox. Boxy is built with Vue.js, and the goal was to create a simple and intuitive user interface to deliver high quality user experience.

_The application is still under active development._

![app-home](github-app-screenshot.png)

## Development setup

The client application is located under ui directory and the server app is located under server.

Execute the following command to run the front end app in Development mode.

```sh
cd .\ui
yarn run install && yarn run dev
```

Start the server app by running the following command.

```sh
cd .\server
yarn run install && yarn run serve
```

## Technology Stack

- [Vue.JS](vue)
- [Apollo Client (powered by vue-apollo)](apollo)
- [Express.JS](express)
- [Graphql (powered by express-graphql)](graphql)
- [Dropbox API for Node.JS](dropbox)
- [Redis for Session Management](redis)

## Release History

- 0.0.1
  - work in progress

## Meta

Prabhu Murthy – [@prabhumurthy2](https://twitter.com/prabhumurthy2) – prabhu.m.murthy@gmail.com

Distributed under the MIT license. See `LICENSE` for more information.

[https://github.com/prabhuingoto/](https://github.com/prabhuingoto/)

<!-- Markdown link & img dfn's -->

[npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[wiki]: https://github.com/yourname/yourproject/wiki
[vue]: https://vuejs.org
[graphql]: https://graphql.org
[apollo]: https://www.apollographql.com/
[redis]: https://redis.io/
[dropbox]: https://www.dropbox.com/developers/documentation/javascript
[express]: https://expressjs.com/
[logo]: ./boxy-logo.png