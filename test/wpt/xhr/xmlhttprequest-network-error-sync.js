import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();
	xhr.open('GET', `${activeURL}/infinite-redirects.py?`, false);

	assert.throws(
		() => {
			xhr.send();
		},
		(err) => {
			assert(err instanceof DOMException, 'DOMException expected');
			assert(err.name === 'NetworkError', 'NetworkError expected');

			return true;
		}
	);

	assert.strictEqual(xhr.status, 0, 'status');
	assert.strictEqual(xhr.statusText, '', 'statusText');
	assert.strictEqual(xhr.getAllResponseHeaders(), '', 'getAllResponseHeaders');
	assert.strictEqual(xhr.getResponseHeader('content-type'), null, 'getResponseHeader');
	assert.strictEqual(xhr.responseText, '', 'responseText');
	assert.strictEqual(xhr.responseXML, null, 'responseXML');
	assert.strictEqual(xhr.readyState, xhr.DONE, 'readyState');
}
﻿
/*
 * xmlhttprequest-network-error-sync.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: members during network errors (sync)</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#infrastructure-for-the-send()-method" data-tested-assertations="following::dl[1]/dt[2] following::dl[1]/dd[2]/p[1]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#network-error" data-tested-assertations=".." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#request-error" data-tested-assertations="following::ol[1]/li[5]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-status-attribute" data-tested-assertations="following::ol[1]/li[1] following::ol[1]/li[2]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-statustext-attribute" data-tested-assertations="following::ol[1]/li[1] following::ol[1]/li[2]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-getresponseheader()-method" data-tested-assertations="following::ol[1]/li[1] following::ol[1]/li[2]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-getallresponseheaders()-method" data-tested-assertations="following::ol[1]/li[1] following::ol[1]/li[2]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-responsetext-attribute" data-tested-assertations="following::ol[1]/li[2] following::ol[1]/li[3]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-responsexml-attribute" data-tested-assertations="following::ol[1]/li[2] following::ol[1]/li[3]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      test(function() {
        var client = new XMLHttpRequest()
        client.open("GET", "resources/infinite-redirects.py", false)
        assert_throws_dom("NetworkError", function() { client.send(null) }, "send")
        assert_equals(client.status, 0, "status")
        assert_equals(client.statusText, "", "statusText")
        assert_equals(client.getAllResponseHeaders(), "", "getAllResponseHeaders")
        assert_equals(client.getResponseHeader("content-type"), null, "getResponseHeader")
        assert_equals(client.responseText, "", "responseText")
        assert_equals(client.responseXML, null, "responseXML")
        assert_equals(client.readyState, client.DONE, "readyState")
      })
    </script>
  </body>
</html>

 *
 * xmlhttprequest-network-error-sync.htm
 */
