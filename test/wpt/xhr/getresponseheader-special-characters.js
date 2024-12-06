import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = () => {
		if(xhr.readyState === 4){

			assert.strictEqual( xhr.getResponseHeader('x-custom-header '), null );
			assert.strictEqual( xhr.getResponseHeader(' x-custom-header'), null );

			assert.strictEqual( xhr.getResponseHeader('x-custom-header-bytes'), '\xE2\x80\xA6' );

			assert.strictEqual( xhr.getResponseHeader('x¾'), null );

			assert.strictEqual( xhr.getResponseHeader('x-custom-header\n'), null );
			assert.strictEqual( xhr.getResponseHeader('\nx-custom-header'), null );
			assert.strictEqual( xhr.getResponseHeader('x-custom-header:'), null );

			xhr.onreadystatechange = null;
		}
	};

	xhr.open('GET', `${activeURL}/headers.py`);
	xhr.send();
}
﻿
/*
 * getresponseheader-special-characters.htm
 *

<!DOCTYPE html>
<html>
  <head>
    <title>XMLHttpRequest: getResponseHeader() funny characters</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#dom-xmlhttprequest-getresponseheader" data-tested-assertations="/following::OL[1]/LI[5] /following::OL[1]/LI[6]" />
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
              assert_equals(client.getResponseHeader("x-custom-header "), null)
              assert_equals(client.getResponseHeader(" x-custom-header"), null)
              assert_equals(client.getResponseHeader("x-custom-header-bytes"), "\xE2\x80\xA6")
              assert_equals(client.getResponseHeader("x¾"), null)
              assert_equals(client.getResponseHeader("x-custom-header\n"), null)
              assert_equals(client.getResponseHeader("\nx-custom-header"), null)
              assert_equals(client.getResponseHeader("x-custom-header:"), null)
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
 * getresponseheader-special-characters.htm
 */
