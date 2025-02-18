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
			assert(headers.indexOf('200 ok')  === -1);
			assert(headers.indexOf('http/1.') === -1);
		}

		if(xhr.readyState === 4)
			assert(true);
		};

	xhr.open('GET', `${activeURL}/headers.py`);
	xhr.send();
}
﻿
/*
 * getallresponseheaders-status.htm
 *

<!DOCTYPE html>
<html>
  <head>
    <title>XMLHttpRequest: getAllResponseHeaders() excludes status</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#dom-xmlhttprequest-getallresponseheaders" data-tested-assertations="/following::OL[1]/LI[1] /following::OL[1]/LI[3]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      async_test(function() {
        var client = new XMLHttpRequest()
        assert_equals(client.getAllResponseHeaders(), "")

        client.onreadystatechange = this.step_func(function() {
          var headers = client.getAllResponseHeaders().toLowerCase()
          if(client.readyState == 1) {
            assert_equals(headers, "")
          }
          if(client.readyState > 1) {
            assert_false(headers.indexOf("200 ok") != -1)
            assert_false(headers.indexOf("http/1.") != -1)
          }
          if(client.readyState == 4)
            this.done()
        })
        client.open("GET", "resources/headers.py")
        client.send(null)
      })
  </script>
 </body>
</html>

 *
 * getallresponseheaders-status.htm
 */
