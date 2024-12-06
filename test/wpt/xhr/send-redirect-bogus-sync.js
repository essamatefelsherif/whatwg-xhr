import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	redirect('301', 'foobar://abcd');
	redirect('302', 'http://z.');
	redirect('302', 'mailto:someone@example.org');
	redirect('303', 'http://z.');
	redirect('303', 'tel:1234567890');

	function redirect(code, location){

		let xhr = new XMLHttpRequest();

		xhr.open('GET', `${activeURL}/redirect.py?location=${location}&code=${code}`, false);

		assert.throws(
			() => {
				xhr.send();
			},
			(err) => {
				assert(err instanceof DOMException, 'DOMException expected');
				assert(err.name === 'NetworkError', 'NetworkError expected');

				return true;
			}
		);
	}
}
﻿
/*
 * send-redirect-bogus-sync.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: send() - Redirects (bogus Location header; sync)</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#infrastructure-for-the-send()-method" data-tested-assertations="following::dl[1]/dt[2] following::dl[1]/dd[2]/ol/li[1] following::dl[1]/dd[2]/ol/li[3]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      function redirect(code, location) {
        test(function() {
          var client = new XMLHttpRequest()
          client.open("GET", "resources/redirect.py?location=" + location + "&code=" + code, false)
          assert_throws_dom("NetworkError", function() { client.send(null) })
        }, document.title + " (" + code + ": " + location + ")")
      }
      redirect("301", "foobar://abcd")
      redirect("302", "http://z.")
      redirect("302", "mailto:someone@example.org")
      redirect("303", "http://z.")
      redirect("303", "tel:1234567890")
    </script>
  </body>
</html>

 *
 * send-redirect-bogus-sync.htm
 */
