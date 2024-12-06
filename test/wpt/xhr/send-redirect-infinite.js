import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	let errorEventFired = false;
	let code = 301;

	xhr.onerror = () => {
		errorEventFired = true;
	};

	xhr.onloadend = () => {
		assert.strictEqual(errorEventFired, true);
		assert.strictEqual(xhr.responseText, '');
		assert.strictEqual(xhr.readyState, 4);

		xhr.onerror = null;
		xhr.onloadend = null;
	};

	xhr.open('GET', `${activeURL}/infinite-redirects.py?type=${code}`);
	xhr.send();
}
﻿
/*
 * send-redirect-infinite.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: send() - Redirects (infinite loop)</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#handler-xhr-onerror" data-tested-assertations="../.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#infrastructure-for-the-send()-method" data-tested-assertations="following::dl[1]/dt[2] following::dl[1]/dd[2]/p[1]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#network-error" data-tested-assertations=".." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#request-error" data-tested-assertations="following::ol[1]/li[4] following::ol[1]/li[9] following::ol[1]/li[10]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-responsetext-attribute" data-tested-assertations="following::ol[1]/li[3]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      var test = async_test()
      var client = new XMLHttpRequest(),
        errorEventFired = false,
        code = 301
      client.open("GET", "resources/infinite-redirects.py?type="+code)
      client.onerror = function(){
        errorEventFired = true
      }
      client.onloadend = function(){
        test.step(function() {
          assert_equals(errorEventFired, true)
          assert_equals(client.responseText, '')
          assert_equals(client.readyState, 4)
          test.done()
        })
      }
      client.send(null)
    </script>
  </body>
</html>

 *
 * send-redirect-infinite.htm
 */
