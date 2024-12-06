import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	let result = [];
	let expected = [1, 4];

	xhr.onreadystatechange = () => {
		result.push(xhr.readyState);
	};

	xhr.open('GET', `${activeURL.replace('/resources', '') + '/folder.txt'}`);
	xhr.open('GET', `${activeURL.replace('/resources', '') + '/folder.txt'}`, false);

	xhr.send();

	assert.strictEqual(xhr.responseText, 'top\n');
	assert.deepStrictEqual(result, expected);

	xhr.onreadystatechange = null;
}
﻿
/*
 * open-open-sync-send.htm
 *

<!DOCTYPE html>
<html>
  <head>
    <title>XMLHttpRequest: open() - open() (sync) - send()</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-open()-method" data-tested-assertations="following::ol/li[14]/ul/li[1] following::ol/li[14]/ul/li[2] following::ol/li[14]/ul/li[3] following::ol/li[15]/ol/li[1] following::ol/li[15]/ol/li[2]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      var test = async_test()
      test.step(function() {
        var client = new XMLHttpRequest(),
            result = [],
            expected = [1,4]
        client.onreadystatechange = function() {
          test.step(function() {
            result.push(client.readyState)
          })
        }
        client.open("GET", "folder.txt")
        client.open("GET", "folder.txt", false)
        client.send(null)
        assert_equals(client.responseText, 'top\n')
        assert_array_equals(result, expected)
        test.done()
      })
    </script>
  </body>
</html>

 *
 * open-open-sync-send.htm
 */
