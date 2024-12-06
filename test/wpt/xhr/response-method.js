import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	['GET', 'HEAD', 'POST'].forEach(method => {

		const xhr = new XMLHttpRequest();

		xhr.open(method, `${activeURL}/echo-method.py`, false);
		xhr.send();

		assert.strictEqual(xhr.responseText, (method === 'HEAD' ? '' : method));
	});
}
﻿
/*
 * response-method.html
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: influence of HTTP method on response</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
  </head>
  <body>
    <div id="log"></div>
    <script>
      ["GET", "HEAD", "POST"].forEach(function(method) {
        test(function() {
          var client = new XMLHttpRequest()
          client.open(method, "resources/echo-method.py", false)
          client.send()
          assert_equals(client.responseText, (method === "HEAD" ? "" : method))
        }, method)
      })
    </script>
  </body>
</html>

 *
 * response-method.html
 */
