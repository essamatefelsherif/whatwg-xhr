import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	const xhr = new XMLHttpRequest();

	xhr.onreadystatechange = () => {
		if(xhr.readyState === 3){
			assert.throws(
				() => {
					xhr.overrideMimeType('application/xml;charset=Shift-JIS');
				},
				(err) => {
					assert(err instanceof DOMException, 'DOMException expected');
					assert(err.name === 'InvalidStateError', 'InvalidStateError expected');

					return true;
				}
			);
		}
		else
		if(xhr.readyState === 4){
			assert.strictEqual(xhr.responseXML, null);
			xhr.onreadystatechange = null;
		}
	};

	xhr.open('GET', `${activeURL}/status.py?type=${encodeURIComponent('text/html;charset=iso-8859-1')}&content=%3Cmsg%3E%83%65%83%58%83%67%3C%2Fmsg%3E`);
	xhr.send();
}
﻿
/*
 * overridemimetype-loading-state.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: overrideMimeType() in LOADING state</title>
    <meta charset="utf-8">
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-overridemimetype()-method" data-tested-assertations="/following::ol/li[1]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      var test = async_test();
      test.step(function() {
        var client = new XMLHttpRequest();
        client.onreadystatechange = test.step_func(function() {
          if (client.readyState === 3){
            assert_throws_dom("InvalidStateError", function(){
              client.overrideMimeType('application/xml;charset=Shift-JIS');
            });
          }else if(client.readyState===4){
            assert_equals(client.responseXML, null);
            test.done();
          }
        });
        client.open("GET", "resources/status.py?type="+encodeURIComponent('text/plain;charset=iso-8859-1')+'&content=%3Cmsg%3E%83%65%83%58%83%67%3C%2Fmsg%3E');
        client.send();
      });
    </script>

  </body>
</html>

 *
 * overridemimetype-loading-state.htm
 */
