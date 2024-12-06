import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	(async() => {

		let p = new Promise(resolve => {

			let xhr = new XMLHttpRequest();

			xhr.onreadystatechange = () => {
				if(xhr.readyState == 4){
					assert.strictEqual(xhr.responseText, 'User-Agent: TEST\n');
					xhr.onreadystatechange = null;
					resolve();
				}
			};

			let location = encodeURIComponent(`${activeURL}/inspect-headers.py?filter_name=user-agent`);

			xhr.open('POST', `${activeURL}/redirect.py?location=${location}`);
			xhr.setRequestHeader('User-Agent', 'TEST');
			xhr.send();
		});

		await p;
	})();
}

/*
 * preserve-ua-header-on-redirect.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: User-Agent header is preserved on redirect</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
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
                assert_equals(client.responseText, 'User-Agent: '+navigator.userAgent+'\n')
                test.done()
              }
            })
          }
        client.open("POST", "resources/redirect.py?location="+encodeURIComponent("inspect-headers.py?filter_name=user-agent"))
        client.send(null)
      })

      var test2 = async_test()
      test2.step(function() {
        var client = new XMLHttpRequest()
          client.onreadystatechange = function() {
            test2.step(function() {
              if(client.readyState == 4) {
                assert_equals(client.responseText, 'User-Agent: TEST\n')
                test2.done()
              }
            })
          }
        client.open("POST", "resources/redirect.py?location="+encodeURIComponent("inspect-headers.py?filter_name=user-agent"))
        client.setRequestHeader("User-Agent", "TEST")
        client.send(null)
      })
    </script>
  </body>
</html>

 *
 * preserve-ua-header-on-redirect.htm
 */
