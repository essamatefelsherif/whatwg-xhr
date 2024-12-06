import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	assert.strictEqual(xhr.getResponseHeader('x-custom-header'), null);

	xhr.onreadystatechange = () => {
		if(xhr.readyState < 2){
			assert.strictEqual(xhr.getResponseHeader('x-custom-header'), null);
			assert.strictEqual(xhr.getResponseHeader('CONTENT-TYPE'), null);
		}
	};

	xhr.open('GET', `${activeURL}/headers.py`);

	assert.strictEqual(xhr.getResponseHeader('x-custom-header'), null);
	assert.strictEqual(xhr.getResponseHeader('Date'), null);

	xhr.send();
}
﻿
/*
 * getresponseheader-unsent-opened-state.htm
 *

<!DOCTYPE html>
<html>
  <head>
    <title>XMLHttpRequest: getResponseHeader() in unsent, opened states</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#dom-xmlhttprequest-getresponseheader" data-tested-assertations="/following::OL[1]/LI[1]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      var test = async_test()
      test.step(function() {
        var client = new XMLHttpRequest()
        assert_equals(client.getResponseHeader("x-custom-header"), null)
        client.onreadystatechange = function() {
          test.step(function() {
            if(client.readyState < 2) {
              assert_equals(client.getResponseHeader("x-custom-header"), null)
              assert_equals(client.getResponseHeader("CONTENT-TYPE"), null)
              test.done()
            }
          })
        }
        client.open("GET", "resources/headers.py")
        assert_equals(client.getResponseHeader("x-custom-header"), null)
        assert_equals(client.getResponseHeader("Date"), null)
        client.send(null)
      })
  </script>
 </body>
</html>

 *
 * getresponseheader-unsent-opened-state.htm
 */
