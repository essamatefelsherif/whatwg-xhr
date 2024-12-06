import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = () => {
		if(xhr.readyState === 4){

			assert.strictEqual(xhr.getResponseHeader('x-custom-header'), 'test');
			assert.strictEqual(xhr.getResponseHeader('X-Custom-Header'), 'test');
			assert.strictEqual(xhr.getResponseHeader('X-CUSTOM-HEADER'), 'test');
			assert.strictEqual(xhr.getResponseHeader('X-custom-HEADER'), 'test');
			assert.strictEqual(xhr.getResponseHeader('X-CUSTOM-header-COMMA'), '1, 2');
			assert.strictEqual(xhr.getResponseHeader('X-CUSTOM-no-such-header-in-response'), null);
			assert.strictEqual(xhr.getResponseHeader('CONTENT-TYPE'), 'text/plain');
		}
	};

	xhr.open('GET', `${activeURL}/headers.py`);
	xhr.send();
}
﻿
/*
 * getresponseheader-case-insensitive.htm
 *

<!DOCTYPE html>
<html>
  <head>
    <title>XMLHttpRequest: getResponseHeader() case-insensitive matching</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#dom-xmlhttprequest-getresponseheader">
  </head>
  <body>
    <div id="log"></div>
    <script>
      var test = async_test()
      test.step(function() {
        var client = new XMLHttpRequest()
        client.onreadystatechange = function() {
          test.step(function() {
            if(client.readyState == 4) {
              assert_equals(client.getResponseHeader("x-custom-header"), "test")
              assert_equals(client.getResponseHeader("X-Custom-Header"), "test")
              assert_equals(client.getResponseHeader("X-CUSTOM-HEADER"), "test")
              assert_equals(client.getResponseHeader("X-custom-HEADER"), "test")
              assert_equals(client.getResponseHeader("X-CUSTOM-header-COMMA"), "1, 2")
              assert_equals(client.getResponseHeader("X-CUSTOM-no-such-header-in-response"), null)
              assert_equals(client.getResponseHeader("CONTENT-TYPE"), "text/plain")
              test.done()
            }
          })
        }
        client.open("GET", "resources/headers.py")
        client.send(null)
      })
  </script>
 </body>
</html>

 *
 * getresponseheader-case-insensitive.htm
 */
