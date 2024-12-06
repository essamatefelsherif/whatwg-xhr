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

		xhr.open(method, `${activeURL}/content.py`);

		xhr.upload.onprogress  = logEvt;
		xhr.upload.onloadstart = logEvt;
		xhr.upload.onloadend   = logEvt;

		xhr.onloadend = () => {

			assert.strictEqual(xhr.getResponseHeader('x-request-content-length'), 'NO');
			assert.strictEqual(xhr.getResponseHeader('x-request-method'), method);
			assert.strictEqual(xhr.responseText, '');

			assert.deepStrictEqual(events, []);
		};

		xhr.send('TEST');
	}
}
﻿
/*
 * send-entity-body-get-head-async.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: send() - non-empty data argument and GET/HEAD - async, no upload events should fire</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
        <link rel="help" href="https://xhr.spec.whatwg.org/#the-send()-method" data-tested-assertations="following::OL[1]/LI[3] following::OL[1]/LI[7] following::OL[1]/LI[8]" />

  </head>
  <body>
    <div id="log"></div>
    <script>
      function request(method) {
        var test = async_test( document.title + " (" + method + ")")
        var events=[]
        var logEvt = function (e) {
          events.push(e.type)
        }
        var client = new XMLHttpRequest()
        client.open(method, "resources/content.py")
        client.upload.addEventListener('progress', logEvt)
        client.upload.addEventListener('loadend', logEvt)
        client.upload.addEventListener('loadstart', logEvt)
        client.addEventListener('loadend', function(){
          test.step(function(){
            assert_equals(client.getResponseHeader("x-request-content-length"), "NO")
            assert_equals(client.getResponseHeader("x-request-method"), method)
            assert_equals(client.responseText, "")
            assert_array_equals(events, [])
            test.done()
          })
        })
        client.send("TEST")
      }
      request("GET")
      request("HEAD")
    </script>
  </body>
</html>

 *
 * send-entity-body-get-head-async.htm
 */
