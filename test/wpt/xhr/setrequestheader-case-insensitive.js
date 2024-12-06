import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	(() => {
		const xhr = new XMLHttpRequest();

		xhr.open('POST', `${activeURL}/inspect-headers.py?filter_value=t1, t2, t3`, false);

		xhr.setRequestHeader('x-test', 't1');
		xhr.setRequestHeader('X-TEST', 't2');
		xhr.setRequestHeader('X-teST', 't3');
		xhr.send();

		assert.strictEqual(xhr.responseText, 'x-test,');
	})();

	(() => {
		const xhr = new XMLHttpRequest();

		xhr.open('GET', `${activeURL}/echo-headers.py`, false);

		xhr.setRequestHeader('THIS-IS-A-TEST', '1');
		xhr.setRequestHeader('THIS-is-A-test', '2');
		xhr.setRequestHeader('content-TYPE', 'x/x');
		xhr.send();

		assert(/content-TYPE/.test(xhr.responseText));
		assert(/THIS-IS-A-TEST: 1, 2/.test(xhr.responseText));
	})();
}

/*
 * setrequestheader-case-insensitive.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: setRequestHeader() - headers that differ in case</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-setrequestheader()-method">
  </head>
  <body>
    <div id="log"></div>
    <script>
      test(function() {
        var client = new XMLHttpRequest()
        client.open("POST", "resources/inspect-headers.py?filter_value=t1, t2, t3", false)
        client.setRequestHeader("x-test", "t1")
        client.setRequestHeader("X-TEST", "t2")
        client.setRequestHeader("X-teST", "t3")
        client.send(null)
        assert_equals(client.responseText, "x-test,")
      })

      test(() => {
        const client = new XMLHttpRequest
        client.open("GET", "resources/echo-headers.py", false)
        client.setRequestHeader("THIS-IS-A-TEST", "1")
        client.setRequestHeader("THIS-is-A-test", "2")
        client.setRequestHeader("content-TYPE", "x/x")
        client.send()
        assert_regexp_match(client.responseText, /content-TYPE/)
        assert_regexp_match(client.responseText, /THIS-IS-A-TEST: 1, 2/)
      })
    </script>
  </body>
</html>

 *
 * setrequestheader-case-insensitive.htm
 */
