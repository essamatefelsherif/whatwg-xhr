import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	let result = [];
	let expected = [1];

	xhr.onreadystatechange = () => {
		result.push(xhr.readyState);
	};

	xhr.open('GET', `${activeURL.replace('/resources', '') + '/folder.txt'}`);
	xhr.send();
	xhr.open('GET', `${activeURL.replace('/resources', '') + '/folder.txt'}`, false);

	assert.deepStrictEqual(result, expected);

	assert.strictEqual(xhr.responseXML, null);
	assert.strictEqual(xhr.responseText, '');
	assert.strictEqual(xhr.status, 0);
	assert.strictEqual(xhr.statusText, '');
	assert.strictEqual(xhr.getAllResponseHeaders(), '');

	xhr.onreadystatechange = null;
}
﻿
/*
 * open-sync-open-send.htm
 *

<!DOCTYPE html>
<html>
  <head>
    <title>XMLHttpRequest: open() (sync) - send() - open()</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-open()-method" data-tested-assertations="following::ol[1]/li[14]/ul/li[1] following::ol[1]/li[14]/ul/li[2] following::ol[1]/li[14]/ul/li[3] following::ol[1]/li[15]/ol/li[1] following::ol[1]/li[15]/ol/li[2]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-responsexml-attribute" data-tested-assertations="following::ol[1]/li[2]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-responsetext-attribute" data-tested-assertations="following::ol[1]/li[2]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-status-attribute" data-tested-assertations="following::ol[1]/li[1]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-statustext-attribute" data-tested-assertations="following::ol[1]/li[1]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-getallresponseheaders()-method" data-tested-assertations="following::ol[1]/li[1]" />

  </head>
  <body>
    <div id="log"></div>
    <script>
      var test = async_test()
      test.step(function() {
        var client = new XMLHttpRequest(),
            result = [],
            expected = [1]
        client.onreadystatechange = function() {
          test.step(function() {
            result.push(client.readyState)
          })
        }
        client.open("GET", "folder.txt")
        client.send(null)
        client.open("GET", "folder.txt", false)
        assert_array_equals(result, expected)
        assert_equals(client.responseXML, null)
        assert_equals(client.responseText, "")
        assert_equals(client.status, 0)
        assert_equals(client.statusText, "")
        assert_equals(client.getAllResponseHeaders(), "")
        test.done()
      })
    </script>
  </body>
</html>

 *
 * open-sync-open-send.htm
 */
