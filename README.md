# XMLHttpRequest

A Node.js implementation of the [WHATWG XMLHttpRequest Living Standard](https://xhr.spec.whatwg.org/) for non-browser environments. The XMLHttpRequest Standard defines an API that provides scripted client functionality for transferring data between a client and a server.

[![Coverage Status](https://coveralls.io/repos/github/essamatefelsherif/whatwg-xhr/badge.svg?branch=main)](https://coveralls.io/github/essamatefelsherif/whatwg-xhr?branch=main)

## References

* [WHATWG XMLHttpRequest Living Standard](https://xhr.spec.whatwg.org/).
* [web-platform-tests](https://web-platform-tests.org/).
* [Mozilla MDN XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest).
* [The Modern JavaScript Tutorial - XMLHttpRequest](https://javascript.info/xmlhttprequest).

## Installation

```sh
npm install [-g] @essamonline/whatwg-xhr
```

## Usage

With CommonJS in JavaScript,

```js
const { XMLHttpRequest } = require('@essamonline/whatwg-xhr');
```

With ESM or TypeScript,

```ts
import { XMLHttpRequest } from '@essamonline/whatwg-xhr';
```

## Testing

A command line testing utility [wpt-xhr](bin/wpt-xhr) was developed and included as an executable script for the user to run and test the software on his local system. The compliance of the developed **XMLHttpRequest** implementation with [WHATWG XMLHttpRequest Living Standard](https://xhr.spec.whatwg.org/) was tested using the live [web-platform-tests](https://web-platform-tests.org/) server, where the [wpt-xhr](bin/wpt-xhr) utility is configured to use by default.


The [web-platform-tests](https://web-platform-tests.org/) allows the [local installation](https://web-platform-tests.org/running-tests/from-local-system.html) of the **wpt** server, for the user to run the tests from his local system, with no need for an internet connection, and in such case the locally installed **wpt** server **MUST** be up and running, and its host and port information are given to the [wpt-xhr](bin/wpt-xhr) as command line arguments before starting the tests.

```sh
Usage: wpt-xhr [OPTIONS]... [URL]

Test the developed *XMLHttpRequest* module for compliance with
WHATWG XMLHttpRequest specs using the web-platform-tests live
or locally installed server as the testing server.

With no URL, testing server is determined by the options given.

  -t, --host[=<host>]  wpt host (default wpt.live)
  -p, --port[=<port>]  wpt port (default 80)
      --path[=<path>]  wpt path (default /xhr/resources/)
  -n  --node           use nodejs test runner API if supported
  -d  --def            use default test runner
  -v  --verbose        make the testing operation more talkative
  -h  --help           display this help and exit
      --version        output version information and exit

Note that invalid host, port or path will not be accepted.

Examples:
  wpt-xhr -t wpt.local -p 8000  Means <http://wpt.local:8000/xhr/resources/>
  wpt-xhr                       Means <http://wpt.live/xhr/resources/>

web-platforms-tests online help: <https://web-platform-tests.org/>
Full documentation <https://essamatefelsherif.github.io/whatwg-xhr/>
```

## Features

* Supports http(s) and "[data](https://www.rfc-editor.org/rfc/rfc2397#section-2 "RFC 2397")" URL schemes.
* Supports FormData, Blobs and Files.
* Supports synchronous and asynchronous operations.
* Independent of any existing implementation of [fetch](https://fetch.spec.whatwg.org/ "WHATWG Fetch Living Standard").
* No current support for "file" URL scheme, CORS or [web streams](https://streams.spec.whatwg.org/ "WHATWG Streams Living Standard").

## Documentation

Source code documentation, along with a test coverage report are both included under [Documentation](https://essamatefelsherif.github.io/whatwg-xhr/ "Documentation").

## Node version support

**whatwg-xhr** supports all currently maintained Node versions >= 15.4.0. See the [Node Release Schedule](https://github.com/nodejs/Release#release-schedule).

## License

This software is licensed under the MIT license, see the [LICENSE](./LICENSE "LICENSE") file.
