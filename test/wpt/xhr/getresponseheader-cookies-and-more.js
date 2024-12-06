import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = () => {
		if(xhr.readyState === 1){
			assert.strictEqual(xhr.getResponseHeader('x-custom-header'), null);
		}

		if(xhr.readyState > 1){
			assert.strictEqual(xhr.getResponseHeader('x-custom-header'),       'test');
			assert.strictEqual(xhr.getResponseHeader('x-custom-header-empty'), ''    );
			assert.strictEqual(xhr.getResponseHeader('set-cookie'),            null  );
			assert.strictEqual(xhr.getResponseHeader('set-cookie2'),           null  );
			assert.strictEqual(xhr.getResponseHeader('x-non-existent-header'), null  );
		}

		if(xhr.readyState === 4)
			assert(true);
	};

	xhr.open('GET', `${activeURL}/headers.py`);
	xhr.send();
}
﻿
/*
 * getresponseheader-cookies-and-more.htm
 *

<!DOCTYPE html>
<html>
  <head>
    <title>XMLHttpRequest: getResponseHeader() custom/non-existent headers and cookies</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#dom-xmlhttprequest-getresponseheader" data-tested-assertations="following::OL[1]/LI[3] following::OL[1]/LI[5] following::OL[1]/LI[6]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      var test = async_test()
      test.step(function() {
        var client = new XMLHttpRequest()
        client.onreadystatechange = function() {
          test.step(function() {
            if(client.readyState == 1) {
              assert_equals(client.getResponseHeader("x-custom-header"), null)
            }
            if(client.readyState > 1) {
              assert_equals(client.getResponseHeader("x-custom-header"), "test")
              assert_equals(client.getResponseHeader("x-custom-header-empty"), "")
              assert_equals(client.getResponseHeader("set-cookie"), null)
              assert_equals(client.getResponseHeader("set-cookie2"), null)
              assert_equals(client.getResponseHeader("x-non-existent-header"), null)
            }
            if(client.readyState == 4)
              test.done()
          })
        }
        client.open("GET", "resources/headers.py")
        client.send(null)
      })
  </script>
 </body>
</html>

 *
 * getresponseheader-cookies-and-more.htm
 */
