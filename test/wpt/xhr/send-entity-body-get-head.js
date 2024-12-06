import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	request('GET');
	request('HEAD');

	function request(method){

		let events = [];
		let logEvt = (e) => {
			events.push(e.type);
		};

		let xhr = new XMLHttpRequest();

		xhr.open(method, `${activeURL}/content.py`, false);
		xhr.send('TEST');

		xhr.upload.onprogress  = logEvt;
		xhr.upload.onloadstart = logEvt;
		xhr.upload.onloadend   = logEvt;

		assert.strictEqual(xhr.getResponseHeader('x-request-content-length'), 'NO');
		assert.strictEqual(xhr.getResponseHeader('x-request-method'), method);
		assert.strictEqual(xhr.responseText, '');

		assert.deepStrictEqual(events, []);
	}
}
﻿
/*
 * send-entity-body-get-head.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: send() - non-empty data argument and GET/HEAD</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
        <link rel="help" href="https://xhr.spec.whatwg.org/#the-send()-method" data-tested-assertations="following::OL[1]/LI[3] following::OL[1]/LI[7]" />

  </head>
  <body>
    <div id="log"></div>
    <script>
      function request(method) {
        test(function() {
          var events=[]
          var logEvt = function (e) {
            events.push(e.type)
          }
          var client = new XMLHttpRequest()
          client.open(method, "resources/content.py", false)
          client.send("TEST")
          client.upload.addEventListener('progress', logEvt)
          client.upload.addEventListener('loadend', logEvt)
          client.upload.addEventListener('loadstart', logEvt)

          assert_equals(client.getResponseHeader("x-request-content-length"), "NO")
          assert_equals(client.getResponseHeader("x-request-method"), method)
          assert_equals(client.responseText, "")
          assert_array_equals(events, [])
        }, document.title + " (" + method + ")")
      }
      request("GET")
      request("HEAD")
    </script>
  </body>
</html>

 *
 * send-entity-body-get-head.htm
 */
