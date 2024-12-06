import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	redirect('301');

	function redirect(code){

		let xhr = new XMLHttpRequest();

		xhr.open('GET', `${activeURL}/infinite-redirects.py?type=${code}`, false);

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
 * send-redirect-infinite-sync.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: send() - Redirects (infinite loop; sync)</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#infrastructure-for-the-send()-method" data-tested-assertations="following::dl[1]/dt[2] following::dl[1]/dd[2]/p[1]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#network-error" data-tested-assertations=".." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#request-error" data-tested-assertations="following::ol[1]/li[5]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      function redirect(code) {
        test(function() {
          var client = new XMLHttpRequest()
          client.open("GET", "resources/infinite-redirects.py?type="+code, false)
          assert_throws_dom("NetworkError", function() { client.send(null) })
        }, document.title + " (" + code + ")")
      }
      redirect("301")
    </script>
  </body>
</html>

 *
 * send-redirect-infinite-sync.htm
 */
