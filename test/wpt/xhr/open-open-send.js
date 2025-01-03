import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	let result = [];
	let expected = [1, 2, 3, 4];

	xhr.onreadystatechange = () => {
		result.push(xhr.readyState);

		if(4 === xhr.readyState){
			assert.deepStrictEqual(result, expected);
			assert(xhr.responseText === 'top\n');

			xhr.onreadystatechange = null;
		}
	};

	xhr.open('GET', `${activeURL}/folder.txt`);
	xhr.open('GET', `${activeURL.replace('/resources', '') + '/folder.txt'}`);

	xhr.send();
}
﻿
/*
 * open-open-send.htm
 *

<!DOCTYPE html>
<html>
  <head>
    <title>XMLHttpRequest: open() - open() - send()</title>
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
            expected = [1,2,3,4]
        client.onreadystatechange = function() {
          test.step(function() {
            result.push(client.readyState)
            if(4 == client.readyState) {
              assert_array_equals(result, expected)
              assert_equals(client.responseText, 'top\n')
              test.done()
            }
          })
        }
        client.open("GET", "resources/folder.txt")
        client.open("GET", "folder.txt")
        client.send(null)
      })
    </script>
  </body>
</html>

 *
 * open-open-send.htm
 */
