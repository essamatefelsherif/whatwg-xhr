import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = () => {

		if(xhr.readyState === 4){
			assert(xhr.getResponseHeader('server') !== null  );
			assert(xhr.getResponseHeader('date')   !== null  );
		}
	};

	xhr.open('GET', `${activeURL}/headers.py`);
	xhr.send();
}
﻿
/*
 * getresponseheader-server-date.htm
 *

<!DOCTYPE html>
<html>
  <head>
    <title>XMLHttpRequest: getResponseHeader() server and date</title>
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
              assert_true(client.getResponseHeader("Server") != null)
              assert_true(client.getResponseHeader("Date") != null)
              test.done()
            }
          })
        }
        client.open("GET", "resources/headers.py")
        client.send(null)
      })
  </script>
 </body>
</html>

 *
 * getresponseheader-server-date.htm
 */
