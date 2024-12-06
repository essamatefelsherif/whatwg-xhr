import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	request('arrayBuffer'); // case sensitive
	request('JSON');        // case sensitive
	request('glob');
	request('txt');
	request('text/html');

	function request(type){

		const xhr = new XMLHttpRequest();

		xhr.responseType = type;
		assert.strictEqual(xhr.responseType, '');

		xhr.open('GET', `${activeURL}/folder.txt`);

		xhr.onload = () => {

			assert.strictEqual(xhr.responseType, '');
			assert.strictEqual(xhr.response, 'bottom\n');
			assert.strictEqual(typeof xhr.response, 'string');

			xhr.onload = null;
		};

		xhr.send();
	}
}
﻿
/*
 * response-invalid-responsetype.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: response is plain text if responseType is set to an invalid string</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-response-attribute" data-tested-assertations="following::dd[2]/ol[1]/li[2]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-responsetype-attribute" data-tested-assertations="following::ol[1]/li[4]" /><!-- Not quite - but this is handled in WebIDL, not the XHR spec -->
  </head>
  <body>
    <div id="log"></div>
    <script>
      function request(type) {
        var test = async_test(document.title+' ('+type+')')
        test.step(function() {
          var client = new XMLHttpRequest()
          client.responseType = type
          assert_equals(client.responseType, '')
          client.open("GET", "resources/folder.txt", true)
          client.onload = function(){
            test.step(function(){
                assert_equals(client.responseType, '')
                assert_equals(client.response, 'bottom\n')
                assert_equals(typeof client.response, 'string')
                test.done()
            })
          }
          client.send(null)
        })
      }
      request("arrayBuffer") // case sensitive
      request("JSON") // case sensitive
      request("glob")
      request("txt")
      request("text/html")
    </script>
  </body>
</html>

 *
 * response-invalid-responsetype.htm
 */
