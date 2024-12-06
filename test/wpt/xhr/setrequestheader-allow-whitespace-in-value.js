import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	request(' ');
	request(' t');
	request('t ');
	request(' t ');

	function request(value){

		const xhr = new XMLHttpRequest();

		xhr.open('POST', `${activeURL}/inspect-headers.py?filter_name=X-Empty`, false);
		xhr.setRequestHeader('X-Empty', value);
		xhr.send();

		assert.strictEqual(xhr.responseText, `X-Empty: ${value.trim()}\n`);
	}
}
﻿
/*
 * setrequestheader-allow-whitespace-in-value.htm
 *

<!DOCTYPE html>
<html>
  <head>
    <title>XMLHttpRequest: setRequestHeader() - header value with whitespace</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-setrequestheader()-method">
  </head>
  <body>
    <div id="log"></div>
    <script>
      function request(value) {
        test(function() {
          var client = new XMLHttpRequest()
          client.open("POST", "resources/inspect-headers.py?filter_name=X-Empty", false)
          client.setRequestHeader('X-Empty', value)
          client.send(null)
          assert_equals(client.responseText, 'X-Empty: ' + value.trim() + '\n' )
        }, document.title + " (" + value + ")")
      }
      request(" ")
      request(" t")
      request("t ")
      request(" t ")
    </script>
  </body>
</html>

 *
 * setrequestheader-allow-whitespace-in-value.htm
 */
