import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	redirect('302', 'http://example.not');
	redirect('302', 'mailto:someone@example.org');
	redirect('303', 'http://example.not');
	redirect('303', 'foobar:someone@example.org');

	function redirect(code, location){

		let xhr = new XMLHttpRequest();

		xhr.onreadystatechange = () => {

			if(xhr.readyState === 4){

				assert.strictEqual(xhr.status, 0);
				assert.strictEqual(xhr.statusText, '');

				xhr.onreadystatechange = null;
			}
		};

		xhr.open('GET', `${activeURL}/redirect.py?location=${location}&code=${code}`);
		xhr.send();
	}
}
﻿
/*
 * send-redirect-bogus.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: send() - Redirects (bogus Location header)</title>
    <meta name=timeout content=long>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#infrastructure-for-the-send()-method" data-tested-assertations="following::dl[1]/dt[2] following::dl[1]/dd[2]/ol/li[1] following::dl[1]/dd[2]/ol/li[3]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      function redirect(code, location) {
        var test = async_test(document.title + " (" + code + ": " + location + ")");
        test.step(function() {
          var client = new XMLHttpRequest()
          client.onreadystatechange = function() {
            test.step(function() {
              if(client.readyState == 4) {
                assert_equals(client.status, 0)
                assert_equals(client.statusText, "")
                test.done()
              }
            })
          }
          client.open("GET", "resources/redirect.py?location=" + location + "&code=" + code)
          client.send(null)
        })
      }
      redirect("302", "http://example.not")
      redirect("302", "mailto:someone@example.org")
      redirect("303", "http://example.not")
      redirect("303", "foobar:someone@example.org")
    </script>
  </body>
</html>

 *
 * send-redirect-bogus.htm
 */
