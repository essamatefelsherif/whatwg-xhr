import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	request('TEST', 'text/plain;charset=UTF-8');

	function request(data, expected_type) {

		let xhr = new XMLHttpRequest();

		xhr.open('POST', `${activeURL}/content.py`, false);
		xhr.send(data);

		assert.strictEqual(xhr.getResponseHeader('x-request-content-type'), expected_type);
	}
}
﻿
/*
 * send-content-type-string.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: send() - Content-Type</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#dom-XMLHttpRequest-send-document" data-tested-assertations="following::p[1] following::p[2] following::p[3]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      function request(data, expected_type) {
        test(function() {
          var client = new XMLHttpRequest()
          client.open("POST", "resources/content.py", false)
          client.send(data)
          assert_equals(client.getResponseHeader("x-request-content-type"), expected_type)
        })
      }
      request("TEST", "text/plain;charset=UTF-8")
      function init(fr) { request(fr.contentDocument, fr.getAttribute("data-t")) }
    </script>
    <iframe src="resources/win-1252-xml.py" onload="init(this)" data-t="application/xml;charset=UTF-8"></iframe>
    <iframe src="resources/win-1252-html.py" onload="init(this)" data-t="text/html;charset=UTF-8"></iframe>
  </body>
</html>

 *
 * send-content-type-string.htm
 */
