import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	request('POST');
	request('PUT');
	request('HEAD');

	function request(method){

		let xhr = new XMLHttpRequest();

		xhr.open(method, `${activeURL}/content.py`, false);

		xhr.upload.onloadstart = () => {
			assert(false, 'this event should not fire for empty string');
		};

		xhr.send('');

		let expectedLength = method == 'HEAD' ? 'NO' : '0';

		assert.strictEqual(xhr.getResponseHeader('x-request-content-length'), expectedLength);
	}
}
﻿
/*
 * send-entity-body-empty.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: send("") - empty entity body</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-send()-method" data-tested-assertations="following::ol[1]/li[7]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#dom-XMLHttpRequest-send-a-string" data-tested-assertations="following::p[1] following::p[2] following::p[3]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      function request(method) {
        var client = new XMLHttpRequest()
        client.open(method, "resources/content.py", false)
        client.upload.onloadstart = function(){assert_unreached('this event should not fire for empty strings')}
        client.send("")
        var expectedLength = method == "HEAD" ? "NO" : "0";
        assert_equals(client.getResponseHeader("x-request-content-length"), expectedLength)
      }
      test(function() { request("POST"); }, document.title + " (POST)");
      test(function() { request("PUT"); }, document.title + " (PUT)");
      test(function() { request("HEAD"); }, document.title + " (HEAD)");
    </script>
  </body>
</html>

 *
 * send-entity-body-empty.htm
 */
