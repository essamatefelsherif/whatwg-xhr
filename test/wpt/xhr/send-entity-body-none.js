import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	noContentTypeTest('POST');	// 'No content type (POST)';
	noContentTypeTest('PUT');	// 'No content type (PUT)';
	noContentTypeTest('HEAD');	// 'No content type (HEAD)';

	function noContentTypeTest(method){

		let xhr = new XMLHttpRequest();

		xhr.open(method, `${activeURL}/content.py`, false);

		xhr.upload.onloadstart = () => {
			assert(false, 'this event should not fire for null');
		};

		xhr.send(null);

		let expectedLength = method == 'HEAD' ? 'NO' : '0';

		assert.strictEqual(xhr.getResponseHeader('x-request-content-length'), expectedLength);
		assert.strictEqual(xhr.getResponseHeader('x-request-content-type'), 'NO');
	}

	explicitContentTypeTest('POST');	// 'Explicit content type (POST)';
	explicitContentTypeTest('PUT');		// 'Explicit content type (PUT)');
	explicitContentTypeTest('HEAD');	// 'Explicit content type (HEAD)');

	function explicitContentTypeTest(method){

		let xhr = new XMLHttpRequest();

		xhr.open(method, `${activeURL}/content.py`, false);

		let content_type = 'application/x-foo';
		xhr.setRequestHeader('Content-Type', content_type);
		xhr.send(null);

		let expectedLength = method == 'HEAD' ? 'NO' : '0';
		assert.strictEqual(xhr.getResponseHeader('x-request-content-length'), expectedLength);
		assert.strictEqual(xhr.getResponseHeader('x-request-content-type'), content_type);
	}
}
﻿
/*
 * send-entity-body-none.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: send(null) - no entity body</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-send()-method" data-tested-assertations="following::ol[1]/li[4] following::ol[1]/li[7]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      function noContentTypeTest(method) {
        var client = new XMLHttpRequest()
        client.open(method, "resources/content.py", false)
        client.upload.onloadstart = function(){assert_unreached('this event should not fire for null')}
        client.send(null)
        var expectedLength = method == "HEAD" ? "NO" : "0";
        assert_equals(client.getResponseHeader("x-request-content-length"), expectedLength)
        assert_equals(client.getResponseHeader("x-request-content-type"), "NO")
      }
      test(function() { noContentTypeTest("POST"); }, "No content type (POST)");
      test(function() { noContentTypeTest("PUT"); }, "No content type (PUT)");
      test(function() { noContentTypeTest("HEAD"); }, "No content type (HEAD)");

      function explicitContentTypeTest(method) {
        var client = new XMLHttpRequest()
        client.open(method, "resources/content.py", false)
        var content_type = 'application/x-foo'
        client.setRequestHeader('Content-Type', content_type)
        client.send(null)
        var expectedLength = method == "HEAD" ? "NO" : "0";
        assert_equals(client.getResponseHeader("x-request-content-length"), expectedLength)
        assert_equals(client.getResponseHeader("x-request-content-type"), content_type)
      }
      test(function() { explicitContentTypeTest("POST"); }, "Explicit content type (POST)");
      test(function() { explicitContentTypeTest("PUT"); }, "Explicit content type (PUT)");
      test(function() { explicitContentTypeTest("HEAD"); }, "Explicit content type (HEAD)");
    </script>
  </body>
</html>

 *
 * send-entity-body-none.htm
 */
