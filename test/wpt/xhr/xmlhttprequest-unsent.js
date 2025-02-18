import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	const xhr = new XMLHttpRequest();

	assert.throws(
		() => {
			xhr.setRequestHeader('x-test', 'test');
		},
		(err) => {
			assert(err instanceof DOMException, 'DOMException expected');
			assert(err.name === 'InvalidStateError', 'InvalidStateError expected');

			return true;
		}
	);

	assert.throws(
		() => {
			xhr.send();
		},
		(err) => {
			assert(err instanceof DOMException, 'DOMException expected');
			assert(err.name === 'InvalidStateError', 'InvalidStateError expected');

			return true;
		}
	);

	assert.strictEqual(xhr.status, 0, 'status');
	assert.strictEqual(xhr.statusText, '', 'statusText');
	assert.strictEqual(xhr.getAllResponseHeaders(), '', 'getAllResponseHeaders');
	assert.strictEqual(xhr.getResponseHeader('x-test'), null, 'getResponseHeader');
	assert.strictEqual(xhr.responseText, '', 'responseText');
	assert.strictEqual(xhr.responseXML, null, 'responseXML');
	assert.strictEqual(xhr.readyState, xhr.UNSENT, 'readyState');
}

/*
 * xmlhttprequest-unsent.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: members during UNSENT</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#dom-xmlhttprequest-unsent" data-tested-assertations=".. following::dd" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#dom-xmlhttprequest-setrequestheader" data-tested-assertations="following::ol/li[1]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-send()-method" data-tested-assertations="following::ol/li[1]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-status-attribute" data-tested-assertations="following::ol/li[1]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-statustext-attribute" data-tested-assertations="following::ol/li[1]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-getresponseheader()-method" data-tested-assertations="following::ol/li[1]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-getallresponseheaders()-method" data-tested-assertations="following::ol/li[1]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-responsetext-attribute" data-tested-assertations="following::ol/li[2]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-responsexml-attribute" data-tested-assertations="following::ol/li[2]" />

  </head>
  <body>
    <div id="log"></div>
    <script>
      test(function() {
        var client = new XMLHttpRequest()
        assert_throws_dom("InvalidStateError", function() { client.setRequestHeader("x-test", "test") }, "setRequestHeader")
        assert_throws_dom("InvalidStateError", function() { client.send(null) }, "send")
        assert_equals(client.status, 0, "status")
        assert_equals(client.statusText, "", "statusText")
        assert_equals(client.getAllResponseHeaders(), "", "getAllResponseHeaders")
        assert_equals(client.getResponseHeader("x-test"), null, "getResponseHeader")
        assert_equals(client.responseText, "", "responseText")
        assert_equals(client.responseXML, null, "responseXML")

        assert_equals(client.readyState, client.UNSENT, "readyState")
      })
    </script>
  </body>
</html>

 *
 * xmlhttprequest-unsent.htm
 */
