import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	request('Authorization');
	request('Pragma');
	request('User-Agent');
	request('Content-Transfer-Encoding');
	request('Content-Type');
	request('Overwrite');
	request('If');
	request('Status-URI');
	request('X-Pink-Unicorn');
	request("!#$%&'*+-.^_`|~0123456789abcdefghijklmnopqrstuvwxyz");

	function request(header){

		const xhr = new XMLHttpRequest();

		xhr.open('POST', `${activeURL}/inspect-headers.py?filter_value=t1, t2`, false);

		xhr.setRequestHeader(header, 't1');
		xhr.setRequestHeader(header, 't2');
		xhr.send();

		assert.strictEqual(xhr.responseText, header + ',');
	}
}

/*
 * setrequestheader-header-allowed.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: setRequestHeader() - headers that are allowed</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-setrequestheader()-method">
  </head>
  <body>
    <div id="log"></div>
    <script>
      function request(header) {
        test(function() {
          var client = new XMLHttpRequest()
          client.open("POST", "resources/inspect-headers.py?filter_value=t1, t2", false)
          client.setRequestHeader(header, "t1")
          client.setRequestHeader(header, "t2")
          client.send(null)
          assert_equals(client.responseText, header + ",")
        }, document.title + " (" + header + ")")
      }
      request("Authorization")
      request("Pragma")
      request("User-Agent")
      request("Content-Transfer-Encoding")
      request("Content-Type")
      request("Overwrite")
      request("If")
      request("Status-URI")
      request("X-Pink-Unicorn")
      request("!#$%&'*+-.^_`|~0123456789abcdefghijklmnopqrstuvwxyz")
    </script>
  </body>
</html>

 *
 * setrequestheader-header-allowed.htm
 */
