import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	redirect('301');
	redirect('302');
	redirect('303');
	redirect('307');

	function redirect(code){

		let xhr = new XMLHttpRequest();

		xhr.onreadystatechange = () => {

			if(xhr.readyState === 4){

				assert.strictEqual(xhr.status + '', code);
				assert.strictEqual(xhr.statusText, 'ABE ODDYSSEE');
				assert.strictEqual(xhr.responseXML.documentElement.localName, 'x');

				xhr.onreadystatechange = null;
			}
		};

		xhr.open('GET', `${activeURL}/status.py?content=<x>x<\/x>&type=text/xml&text=ABE ODDYSSEE&code=${code}`);
		xhr.send();
	}
}
﻿
/*
 * send-redirect-no-location.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: send() - Redirects (no Location header)</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#infrastructure-for-the-send()-method" data-tested-assertations="following::dl[1]/dt[2]" />
    <!--
      NOTE: the XHR spec does not really handle this scenario. It's handled in the Fetch spec:
      "If response's headers do not contain a header whose name is Location, return response."
     -->
  </head>
  <body>
    <div id="log"></div>
    <script>
      function redirect(code) {
        var test = async_test(document.title + " (" + code + ")")
        test.step(function() {
          var client = new XMLHttpRequest()
          client.onreadystatechange = function() {
            test.step(function() {
              if(client.readyState == 4) {
                assert_equals(client.status + "", code)
                assert_equals(client.statusText, "ABE ODDYSSEE")
                assert_equals(client.responseXML.documentElement.localName, "x")
                test.done()
              }
            })
          }
          client.open("GET", "resources/status.py?content=<x>x<\/x>&type=text/xml&text=ABE ODDYSSEE&code=" + code)
          client.send(null)
        })
      }
      redirect("301")
      redirect("302")
      redirect("303")
      redirect("307")
    </script>
  </body>
</html>

 *
 * send-redirect-no-location.htm
 */
