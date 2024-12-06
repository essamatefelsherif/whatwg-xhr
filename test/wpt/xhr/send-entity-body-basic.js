import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	request(1, '1');
	request(10000000, '10000000');
	request([2,2], '2,2');
	request(false, 'false');
	request('A\0A', 'A\0A');
	request(new URLSearchParams([[1, 2], [3, 4]]), '1=2&3=4');

	function request(input, output){

		let xhr = new XMLHttpRequest();

		xhr.open('POST', `${activeURL}/content.py`, false);
		xhr.send(input);

		assert.strictEqual(xhr.responseText, output);
	}
}
﻿
/*
 * send-entity-body-basic.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: send() - data argument</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-send()-method" data-tested-assertations="/following::ol/li[4]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      function request(input, output) {
        test(function() {
          var client = new XMLHttpRequest()
          client.open("POST", "resources/content.py", false)
          client.send(input)
          assert_equals(client.responseText, output)
        }, document.title + " (" + output + ")")
      }
      request(1, "1")
      request(10000000, "10000000")
      request([2,2], "2,2")
      request(false, "false")
      request("A\0A", "A\0A")
      request(new URLSearchParams([[1, 2], [3, 4]]), "1=2&3=4")
    </script>
  </body>
</html>

 *
 * send-entity-body-basic.htm
 */
