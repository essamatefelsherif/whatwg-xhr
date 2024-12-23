import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'http://{{host}}:1', false); // Bad port.

	assert.throws(
		() => {
			xhr.send('Test Message');
		},
		(err) => {
			assert(err instanceof DOMException, 'DOMException expected');
			assert(err.name === 'NetworkError', 'NetworkError expected');

			return true;
		}
	);
	assert.strictEqual(xhr.readyState, 4);

	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'data:text/html;charset=utf-8;base64,PT0NUWVBFIGh0bWw%2BDQo8', false);

	assert.throws(
		() => {
			xhr.send('Test Message');
		},
		(err) => {
			assert(err instanceof DOMException, 'DOMException expected');
			assert(err.name === 'NetworkError', 'NetworkError expected');

			return true;
		}
	);
	assert.strictEqual(xhr.readyState, 4);
}
﻿
/*
 * send-network-error-sync-events.sub.htm
 *

<!DOCTYPE html>
<html>
<head>
    <link rel="help" href="https://xhr.spec.whatwg.org/#infrastructure-for-the-send()-method" data-tested-assertations="following::dt[4] following::dd[4]/p" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#network-error" data-tested-assertations=".." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#request-error" data-tested-assertations="following::ol[1]/li[4] following::ol[1]/li[5]" />
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <title>XMLHttpRequest: The send() method: Throw a "throw an "NetworkError" exception when Network error happens (synchronous flag is set)</title>
</head>

<body>
    <div id="log"></div>

    <script type="text/javascript">
        test(function()
        {
            var xhr = new XMLHttpRequest();

            xhr.open("POST", "http://{{host}}:1", false); // Bad port.

            assert_throws_dom("NetworkError", function()
            {
                xhr.send("Test Message");
            });
            assert_equals(xhr.readyState, 4)

        }, "http URL");

        test(function()
        {
            var xhr = new XMLHttpRequest();

            xhr.open("GET", "data:text/html;charset=utf-8;base64,PT0NUWVBFIGh0bWw%2BDQo8", false);

            assert_throws_dom("NetworkError", function()
            {
                xhr.send("Test Message");
            });
            assert_equals(xhr.readyState, 4)

        }, "data URL");
    </script>
</body>
</html>

 *
 * send-network-error-sync-events.sub.htm
 */
