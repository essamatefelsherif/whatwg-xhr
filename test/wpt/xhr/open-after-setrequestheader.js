import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = () => {

		if(xhr.readyState === 4){
			assert.strictEqual(xhr.responseText, '');
			xhr.onreadystatechange = null;
		}
	};

	xhr.open('GET', `${activeURL}/inspect-headers.py?filter_name=X-foo`);
	assert.strictEqual(xhr.readyState, 1);

	xhr.setRequestHeader('X-foo', 'bar');

	xhr.open('GET', `${activeURL}/inspect-headers.py?filter_name=X-foo`);
	assert.strictEqual(xhr.readyState, 1);

	xhr.send();
}
﻿
/*
 * open-after-setrequestheader.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: open() after setRequestHeader()</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-open()-method">

  </head>
  <body>
    <div id="log"></div>
    <script>
      var test = async_test()
      test.step(function() {
        var client = new XMLHttpRequest()
        client.onreadystatechange = function() {
          test.step(function() {
            if(client.readyState === 4){
              assert_equals(client.responseText, '')
              test.done()
            }
          })
        }
        client.open("GET", "resources/inspect-headers.py?filter_name=X-foo")
        assert_equals(client.readyState, 1)
        client.setRequestHeader('X-foo', 'bar')
        client.open("GET", "resources/inspect-headers.py?filter_name=X-foo")
        assert_equals(client.readyState, 1)
        client.send()
      })
    </script>
  </body>
</html>

 *
 * open-after-setrequestheader.htm
 */
