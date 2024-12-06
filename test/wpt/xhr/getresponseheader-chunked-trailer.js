import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = () => {

		if(xhr.readyState === 4){

			assert.strictEqual(xhr.getResponseHeader('Trailer'), 'X-Test-Me');
			assert.strictEqual(xhr.getResponseHeader('X-Test-Me'), null);
			assert.strictEqual(xhr.getAllResponseHeaders().indexOf('Trailer header value'), -1);

			assert(/trailer:\sX-Test-Me/.test( xhr.getAllResponseHeaders()  ));

			assert.strictEqual(xhr.responseText, 'First chunk\r\nSecond chunk\r\nYet another (third) chunk\r\nYet another (fourth) chunk\r\n');
		}
	};

	xhr.open('GET', `${activeURL}/chunked.py`);
	xhr.send();
}
﻿
/*
 * getresponseheader-chunked-trailer.htm
 *

<!DOCTYPE html>
<html>
  <head>
    <title>XMLHttpRequest: getResponseHeader() and HTTP trailer</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#dom-xmlhttprequest-getresponseheader" data-tested-assertations="/following::OL[1]/LI[4] /following::OL[1]/LI[5] /following::OL[1]/LI[6]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      var test = async_test()
      test.step(function() {
        var client = new XMLHttpRequest()
        client.onreadystatechange = function() {
          test.step(function() {
            if(client.readyState == 4) {
              assert_equals(client.getResponseHeader('Trailer'), 'X-Test-Me')
              assert_equals(client.getResponseHeader('X-Test-Me'), null)
              assert_equals(client.getAllResponseHeaders().indexOf('Trailer header value'), -1)
              assert_regexp_match(client.getAllResponseHeaders(), /trailer:\sX-Test-Me/)
              assert_equals(client.responseText, "First chunk\r\nSecond chunk\r\nYet another (third) chunk\r\nYet another (fourth) chunk\r\n")
              test.done()
            }
          })
        }
        client.open("GET", "resources/chunked.py")
        client.send(null)
      })
  </script>
 </body>
</html>

 *
 * getresponseheader-chunked-trailer.htm
 */
