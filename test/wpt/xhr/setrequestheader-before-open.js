import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	assert.throws(
		() => {
			xhr.setRequestHeader('x-test', 'test');
		},
		(err) => {
			assert(err instanceof DOMException, 'DOMException expected');
			assert(err.name === 'InvalidStateError', 'InvalidStateError expected');

			return true;
		}
	);
}

/*
 * setrequestheader-before-open.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: setRequestHeader() before open()</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-setrequestheader()-method" data-tested-assertations="following::ol/li[1]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      test(function() {
        var client = new XMLHttpRequest()
        assert_throws_dom("InvalidStateError", function() { client.setRequestHeader("x-test", "test") })
        }, 'setRequestHeader invoked before open()')
    </script>
  </body>
</html>

 *
 * setrequestheader-before-open.htm
 */
