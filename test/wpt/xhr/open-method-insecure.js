import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	method('track');
	method('TRACK');
	method('trAck');
	method('TRACE');
	method('trace');
	method('traCE');
	method('connect');
	method('CONNECT');
	method('connECT');

	function method(method){
		assert.throws(
			() => {
				xhr.open(method, '...');
			},
			(err) => {
				assert(err instanceof DOMException, 'DOMException expected');
				assert(err.name === 'SecurityError', 'SecurityError expected');

				return true;
			}
		);
	}
}

/*
 * open-method-insecure.mjs
 *

<!DOCTYPE html>
<html>
  <head>
    <title>XMLHttpRequest: open() - "insecure" methods</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-open()-method" data-tested-assertations="following::ol/li[5] following::ol/li[6]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      function method(method) {
        test(function() {
          var client = new XMLHttpRequest()
          assert_throws_dom("SecurityError", function() { client.open(method, "...") })
        }, document.title + " (" + method + ")")
      }
      method("track")
      method("TRACK")
      method("trAck")
      method("TRACE")
      method("trace")
      method("traCE")
      method("connect")
      method("CONNECT")
      method("connECT")
    </script>
  </body>
</html>

 *
 * open-method-insecure.mjs
 */
