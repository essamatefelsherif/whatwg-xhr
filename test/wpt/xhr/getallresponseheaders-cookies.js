import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	assert.strictEqual(xhr.getAllResponseHeaders(), '');

	xhr.onreadystatechange = () => {
		let headers = xhr.getAllResponseHeaders().toLowerCase();

		if(xhr.readyState === 1){
			assert.strictEqual(headers, '');
		}

		if(xhr.readyState > 1){

			assert(headers.indexOf('\r\n')            !== -1, 'carriage return');
			assert(headers.indexOf('content-type')    !== -1, 'content-type');
			assert(headers.indexOf('x-custom-header') !== -1, 'x-custom-header');

			assert(headers.indexOf('set-cookie')  === -1, 'set-cookie');
			assert(headers.indexOf('set-cookie2') === -1, 'set-cookie2');
		}

		if(xhr.readyState === 4){
			assert(true);
		}
	};

	xhr.open('GET', `${activeURL}/headers.py`);
	xhr.send();
}
﻿
/*
 * getallresponseheaders-cookies.htm
 *

<!DOCTYPE html>
<html>
  <head>
    <title>XMLHttpRequest: getAllResponseHeaders() excludes cookies</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#dom-xmlhttprequest-getallresponseheaders" data-tested-assertations="/following::OL[1]/LI[1] /following::OL[1]/LI[3]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      var test = async_test()
      test.step(function() {
        var client = new XMLHttpRequest()
        assert_equals(client.getAllResponseHeaders(), "")
        client.onreadystatechange = function() {
          test.step(function() {
            var headers = client.getAllResponseHeaders().toLowerCase()
            if(client.readyState == 1) {
              assert_equals(headers, "")
            }
            if(client.readyState > 1) {
              assert_true(headers.indexOf("\r\n") != -1, "carriage return")
              assert_true(headers.indexOf("content-type") != -1, "content-type")
              assert_true(headers.indexOf("x-custom-header") != -1, "x-custom-header")
              assert_false(headers.indexOf("set-cookie") != -1, "set-cookie")
              assert_false(headers.indexOf("set-cookie2") != -1, "set-cookie2")
            }
            if(client.readyState == 4)
              test.done()
          })
        }
        client.open("GET", "resources/headers.py")
        client.send(null)
      })
  </script>
 </body>
</html>

 *
 * getallresponseheaders-cookies.htm
 */
