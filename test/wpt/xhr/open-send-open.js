import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	let result = [];
	let expected = [1, 'a', 'b', 'c'];

	xhr.onreadystatechange = () => {
		result.push(xhr.readyState);
	};

	xhr.open('GET', `${activeURL.replace('/resources', '') + '/folder.txt'}`);
	result.push('a');

	xhr.send();
	result.push('b');

	xhr.open('GET', `${activeURL.replace('/resources', '') + '/folder.txt'}`);
	result.push('c');

	assert.deepStrictEqual(result, expected);
}
﻿
/*
 * open-send-open.htm
 *

<!DOCTYPE html>
<html>
  <head>
    <title>XMLHttpRequest: open() - send() - open()</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-open()-method" data-tested-assertations="following::ol/li[14]/ul/li[1] following::ol/li[14]/ul/li[2] following::ol/li[15]/ol/li[1] following::ol/li[15]/ol/li[2]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      var test = async_test()
      test.step(function() {
        var client = new XMLHttpRequest(),
            result = [],
            expected = [1, 'a', 'b', 'c']
        client.onreadystatechange = function() {
          test.step(function() {
            result.push(client.readyState)
          })
        }
        client.open("GET", "folder.txt")
        result.push('a')
        client.send()
        result.push('b')
        client.open("GET", "folder.txt")
        result.push('c')
        assert_array_equals(result, expected)
        test.done()
      })
    </script>
  </body>
</html>

 *
 * open-send-open.htm
 */
