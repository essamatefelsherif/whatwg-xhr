import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let redirect_codes = new Set([301, 302, 303, 307, 308]);

	for(let number of [300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 350, 399]){
		redirect(number);
	}

	function redirect(code){

		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = () => {

			if(xhr.readyState === 4){
				if(redirect_codes.has(code)){
					assert.strictEqual(xhr.getResponseHeader('x-request-method'), 'GET');
					assert.strictEqual(xhr.getResponseHeader('x-request-content-type'), 'application/x-pony');
					assert.strictEqual(xhr.status, 200);
				}
				else{
					assert.strictEqual(xhr.getResponseHeader('x-request-method'), null);
					assert.strictEqual(xhr.getResponseHeader('x-request-content-type'), null);
					assert.strictEqual(xhr.status, code);
				}
				xhr.onreadystatechange = null;
			}
		};

		xhr.open('GET', `${activeURL}/redirect.py?location=/xhr/resources/content.py&code=${code}`);
		xhr.setRequestHeader('Content-Type', 'application/x-pony');
		xhr.send();
	}
}
﻿
/*
 * send-redirect.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: send() - Redirects (basics)</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#infrastructure-for-the-send()-method" data-tested-assertations="following::dl[1]/dt[2] following::dl[1]/dd[2]/ol/li[1] following::dl[1]/dd[2]/ol/li[2]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      // https://fetch.spec.whatwg.org/#statuses
      var redirect_codes = new Set([301, 302, 303, 307, 308]);
      function redirect(code) {
        var test = async_test(`${document.title} (${code} does ${redirect_codes.has(code)? "redirect": "not redirect"})`);
        test.step(function() {
          var client = new XMLHttpRequest();
          client.onreadystatechange = function() {
            test.step(function() {
              if(client.readyState == 4) {
                if (redirect_codes.has(code)) {
                  assert_equals(client.getResponseHeader("x-request-method"), "GET");
                  assert_equals(client.getResponseHeader("x-request-content-type"), "application/x-pony");
                  assert_equals(client.status, 200);
                } else {
                  assert_equals(client.getResponseHeader("x-request-method"), null);
                  assert_equals(client.getResponseHeader("x-request-content-type"), null);
                  assert_equals(client.status, code);
                }
                test.done();
              }
            })
          }
          client.open("GET", "resources/redirect.py?location=content.py&code=" + code);
          client.setRequestHeader("Content-Type", "application/x-pony");
          client.send(null);
        })
      }

      for (var number of [300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 350, 399]) {
        redirect(number);
      }
    </script>
  </body>
</html>

 *
 * send-redirect.htm
 */
