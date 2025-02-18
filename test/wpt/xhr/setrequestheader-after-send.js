import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	xhr.open('GET', `${activeURL}/delay.py?ms=0`);

	xhr.onreadystatechange = () => {
		assert.throws(
			() => {
				xhr.setRequestHeader('x-test', 'test');
			},
			(err) => {
				assert(err instanceof DOMException, 'DOMException expected');
				assert(err.name === 'InvalidStateError', 'InvalidStateError expected');

				return true;
			}
		);
	};

	xhr.send();
}

/*
 * setrequestheader-after-send.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: setRequestHeader() after send()</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-setrequestheader()-method" data-tested-assertations="/following::ol/li[2]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      var test = async_test()
      test.step(function() {
        var client = new XMLHttpRequest()
        client.open("GET", "resources/delay.py?ms=0")
        client.onreadystatechange = function() {
          test.step(function() {
            assert_throws_dom("InvalidStateError", function() { client.setRequestHeader("x-test", "test") })
            if(client.readyState == 4)
              test.done()
          })
        }
        client.send(null)
      })
    </script>
  </body>
</html>

 *
 * setrequestheader-after-send.htm
 */
