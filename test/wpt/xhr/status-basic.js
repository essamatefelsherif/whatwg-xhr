import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let counter = 0;

	status(204,	'UNICORNSWIN',	'',	'');
	status(401, 'OH HELLO', 'Not today.', '');
	//	status(402, 'FIVE BUCKS', '<x>402<\/x>', 'text/xml');
	status(402, 'FREE', 'Nice!', 'text/doesnotmatter');
	status(402, '402 TEH AWESOME', '', '');
	status(502, 'YO', '', '');
	status(502, 'lowercase', 'SWEET POTATO', 'text/plain');
	status(503, 'HOUSTON WE HAVE A', '503', 'text/plain');
	status(699, 'WAY OUTTA RANGE', '699', 'text/plain');

	function status(code, text, content, type){
		statusRequest('GET',     code, text, content, type);
		statusRequest('HEAD',    code, text, content, type);
		statusRequest('CHICKEN', code, text, content, type);
	}

	function statusRequest(method, code, text, content, type){

		let xhr = new XMLHttpRequest();
		assert.strictEqual(xhr.status, 0);

		let url = `${activeURL}/status.py?code=`;

		url += encodeURIComponent(code);
		url += '&text=' + text;
		url += '&content=' + encodeURIComponent(content);
		url += '&type=' + encodeURIComponent(type);

		xhr.open(method, url, false);
		assert.strictEqual(xhr.status, 0);

		xhr.send();
		assert.strictEqual(xhr.status, code);
		assert.strictEqual(xhr.statusText, text);
		assert.strictEqual(xhr.getResponseHeader('X-Request-Method'), method);

		if(method !== 'HEAD'){
			if(type === 'text/xml'){
				assert.strictEqual(xhr.responseXML.documentElement.localName, 'x');
			}
			assert.strictEqual(xhr.responseText, content);
		}
	}
}
﻿
/*
 * status-basic.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: status/statusText - various responses</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-status-attribute" data-tested-assertations="following::ol/li[3]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-statustext-attribute" data-tested-assertations="following::ol/li[3]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-getresponseheader()-method" data-tested-assertations="following::ol/li[5]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-responsetext-attribute" data-tested-assertations="following::ol/li[4]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
    var counter = 0
      function statusRequest(method, code, text, content, type) {
        counter++
        test(function() {
          var client = new XMLHttpRequest()
          assert_equals(client.status, 0);
          client.open(method, "resources/status.py?code=" + code + "&text=" + encodeURIComponent(text) + "&content=" + encodeURIComponent(content) + "&type=" + encodeURIComponent(type), false)
          assert_equals(client.status, 0);
          client.send(null)
          assert_equals(client.status, code)
          assert_equals(client.statusText, text)
          assert_equals(client.getResponseHeader("X-Request-Method"), method)
          if(method != "HEAD") {
            if(type == "text/xml") {
              assert_equals(client.responseXML.documentElement.localName, "x")
            }
            assert_equals(client.responseText, content)
          }
        }, document.title + " " + counter + " (" + method + " " + code + ")")
      }
      function status(code, text, content, type) {
        statusRequest("GET", code, text, content, type)
        statusRequest("HEAD", code, text, content, type)
        statusRequest("CHICKEN", code, text, content, type)
      }
      status(204, "UNICORNSWIN", "", "")
      status(401, "OH HELLO", "Not today.", "")
      status(402, "FIVE BUCKS", "<x>402<\/x>", "text/xml")
      status(402, "FREE", "Nice!", "text/doesnotmatter")
      status(402, "402 TEH AWESOME", "", "")
      status(502, "YO", "", "")
      status(502, "lowercase", "SWEET POTATO", "text/plain")
      status(503, "HOUSTON WE HAVE A", "503", "text/plain")
      status(699, "WAY OUTTA RANGE", "699", "text/plain")
    </script>
  </body>
</html>

 *
 * status-basic.htm
 */
