import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	do_test('GET',     'data:text/plain,Hello, World!');
	do_test('GET',     'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==', undefined, ' (base64)');
	do_test('GET',     'data:text/html,Hello, World!', 'text/html');
	do_test('GET',     'data:text/html;charset=UTF-8,Hello, World!', 'text/html;charset=UTF-8');
	do_test('GET',     'data:image/png,Hello, World!', 'image/png');
	do_test('POST',    'data:text/plain,Hello, World!');
	do_test('PUT',     'data:text/plain,Hello, World!');
	do_test('DELETE',  'data:text/plain,Hello, World!');
	do_test('HEAD',    'data:text/plain,Hello, World!');
	do_test('UNICORN', 'data:text/plain,Hello, World!');

	function do_test(method, url, mimeType, testNamePostfix){

		if(typeof mimeType === 'undefined' || mimeType === null)
			mimeType = 'text/plain';

		let xhr = new XMLHttpRequest();
		let body = method === 'HEAD' ? '' : 'Hello, World!';

		xhr.onreadystatechange = () => {
			if(xhr.readyState !== 4)
				return;

			assert.strictEqual(xhr.responseText, body);
			assert.strictEqual(xhr.status, 200);
			assert.strictEqual(xhr.getResponseHeader('Content-Type'), mimeType);

			let allHeaders = xhr.getAllResponseHeaders();

			assert(/content\-type\:/i.test(allHeaders),    'getAllResponseHeaders() includes Content-Type');
			assert(!/content\-length\:/i.test(allHeaders), 'getAllResponseHeaders() must not include Content-Length');

			xhr.onreadystatechange = null;
		};

		xhr.open(method, url);
		xhr.send(null);
	}
}
﻿
/*
 * data-uri.htm
 *

<!doctype html>
<meta charset=utf-8>
<title>XMLHttpRequest: data URLs</title>
<script src="/resources/testharness.js"></script>
<script src="/resources/testharnessreport.js"></script>
<div id="log"></div>

<script>
  function do_test(method, url, mimeType, testNamePostfix) {
    if (typeof mimeType === 'undefined' || mimeType === null) mimeType = 'text/plain';
    var test = async_test("XHR method " + method + " with MIME type " + mimeType + (testNamePostfix||''));
    test.step(function() {
      var client = new XMLHttpRequest(),
          body = method === "HEAD" ? "" : "Hello, World!";
      client.onreadystatechange = test.step_func(function () {
        if (client.readyState !== 4) {
          return;
        }
        assert_equals(client.responseText, body);
        assert_equals(client.status, 200);
        assert_equals(client.getResponseHeader('Content-Type'), mimeType);
        var allHeaders = client.getAllResponseHeaders();
        assert_regexp_match(allHeaders, /content\-type\:/i, 'getAllResponseHeaders() includes Content-Type');
        assert_false(/content\-length\:/i.test(allHeaders), 'getAllResponseHeaders() must not include Content-Length');
        test.done();
      });
      client.open(method, url);
      client.send(null);
    });
  }
  do_test('GET', "data:text/plain,Hello, World!");
  do_test('GET', "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==", undefined, " (base64)");
  do_test('GET', "data:text/html,Hello, World!", 'text/html');
  do_test('GET', "data:text/html;charset=UTF-8,Hello, World!", 'text/html;charset=UTF-8');
  do_test('GET', "data:image/png,Hello, World!", 'image/png');
  do_test('POST', "data:text/plain,Hello, World!");
  do_test('PUT', "data:text/plain,Hello, World!");
  do_test('DELETE', "data:text/plain,Hello, World!");
  do_test('HEAD', "data:text/plain,Hello, World!");
  do_test('UNICORN', "data:text/plain,Hello, World!");
</script>

 *
 * data-uri.htm
 */
