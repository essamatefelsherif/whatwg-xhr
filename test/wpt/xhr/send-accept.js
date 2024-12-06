import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	xhr.open('GET', `${activeURL}/accept.py`, false);
	xhr.send();
	assert.strictEqual(xhr.responseText, '*/*');

	/**/

	xhr.open('GET', `${activeURL}/accept.py`, false);
	xhr.setRequestHeader('Accept', 'x-something/vague, text/html5');
	xhr.send();
	assert.strictEqual(xhr.responseText, 'x-something/vague, text/html5');
}
﻿
/*
 * send-accept.htm
 */

// <!doctype html>
// <html>
//   <head>
//     <title>XMLHttpRequest: send() - Accept</title>
//     <script src="/resources/testharness.js"></script>
//     <script src="/resources/testharnessreport.js"></script>
//     <link rel="help" href="https://xhr.spec.whatwg.org/#the-send()-method" data-tested-assertations="following::code[contains(text(),'*/*')]/.. following::code[contains(text(),'Accept')]/.. following::code[contains(text(),'Accept')]/../following::ul[1]/li[1]" />
//   </head>
//   <body>
//     <div id="log"></div>
//     <script>
//       test(function() {
//         var client = new XMLHttpRequest()
//         client.open("GET", "resources/accept.py", false)
//         client.send(null)
//         assert_equals(client.responseText, "*/*")
//         client.open("GET", "resources/accept.py", false)
//         client.setRequestHeader("Accept", "x-something/vague, text/html5")
//         client.send(null)
//         assert_equals(client.responseText, "x-something/vague, text/html5")
//       })
//     </script>
//   </body>
// </html>

/*
 * send-accept.htm
 */
