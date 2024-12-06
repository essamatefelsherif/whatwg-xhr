import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = () => {

		assert.strictEqual(xhr.status, 0, 'status');
		assert.strictEqual(xhr.statusText, '', 'statusText');
		assert.strictEqual(xhr.getAllResponseHeaders(), '', 'getAllResponseHeaders');
		assert.strictEqual(xhr.getResponseHeader('content-type'), null, 'getResponseHeader');
		assert.strictEqual(xhr.responseText, '', 'responseText');
		assert.strictEqual(xhr.responseXML, null, 'responseXML');

		if(xhr.readyState === 4)
			xhr.onreadystatechange = null;
	};

	xhr.open('GET', `${activeURL}/infinite-redirects.py?`);
	xhr.send();
}
﻿
/*
 * xmlhttprequest-network-error.htm
 *

<!DOCTYPE html>
<html>
  <head>
    <title>XMLHttpRequest: members during network errors</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#infrastructure-for-the-send()-method" data-tested-assertations="following::dl[1]/dt[2] following::dl[1]/dd[2]/ol/li[1] following::dl[1]/dd[2]/ol/li[2]" />
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
      var test = async_test()
      test.step(function() {
        var client = new XMLHttpRequest()
        client.onreadystatechange = function() {
          test.step(function() {
            assert_equals(client.status, 0, "status")
            assert_equals(client.statusText, "", "statusText")
            assert_equals(client.getAllResponseHeaders(), "", "getAllResponseHeaders")
            assert_equals(client.getResponseHeader("content-type"), null, "getResponseHeader")
            assert_equals(client.responseText, "", "responseText")
            assert_equals(client.responseXML, null, "responseXML")
            if(client.readyState == 4)
              test.done()
          })
        }
        client.open("GET", "resources/infinite-redirects.py")
        client.send(null)
      })
  </script>
 </body>
</html>

 *
 * xmlhttprequest-network-error.htm
 */
