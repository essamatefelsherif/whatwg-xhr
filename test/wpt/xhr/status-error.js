import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	noError('GET', 200);
	noError('GET', 400);
	noError('GET', 401);
	noError('GET', 404);
	noError('GET', 410);
	noError('GET', 500);
	noError('GET', 699);

	noError('HEAD', 200);
	noError('HEAD', 404);
	noError('HEAD', 500);
	noError('HEAD', 699);

	noError('POST', 200);
	noError('POST', 404);
	noError('POST', 500);
	noError('POST', 699);

	noError('PUT', 200);
	noError('PUT', 404);
	noError('PUT', 500);
	noError('PUT', 699);

	unknownScheme();
	postOnBlob();

	function noError(method, code){

		let xhr = new XMLHttpRequest();

		xhr.open(method, `${activeURL}/status.py?code=${code}`, true);

		xhr.onreadystatechange = () => {
			assert.strictEqual(xhr.response, '', 'response data');
			assert.strictEqual(xhr.status, code, 'response status');

			if(xhr.readyState === xhr.DONE)
				// Give extra time for a bogus error event to pop up
				setTimeout(() => {
					xhr.onreadystatechange = null;
				}, 100);
		};

		xhr.onerror = () => {
			assert(false, 'HTTP error should not throw error event');
		};

		xhr.send();
	}

	function unknownScheme(){

		let xhr = new XMLHttpRequest();
		xhr.open('GET', 'foobar://dummy', false);

		try{
			xhr.send();
		}
		catch(ex){
		}

		assert.strictEqual(xhr.status, 0, 'response data');
	}

	function postOnBlob(){

		let u = URL.createObjectURL(new Blob([''], {type: 'text/plain'}));
		let xhr = new XMLHttpRequest();

		xhr.open('POST', u, false);

		try{
			xhr.send();
		}
		catch(ex){
		}

		assert.strictEqual(xhr.status, 0, 'response data');
	}
}
﻿
/*
 * status-error.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: status error handling</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#handler-xhr-onerror" data-tested-assertations="../.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-status-attribute" data-tested-assertations="/following::ol/li[3]" />
  </head>
  <body>
    <p>This shouldn't be tested inside a tunnel.</p>
    <div id="log"></div>
    <script>
      function noError(method, code) {
        var test = async_test(document.title + " " + method + " " + code)

        test.step(function() {
          var client = new XMLHttpRequest()
          client.open(method, "resources/status.py?code=" + code, true)

          client.onreadystatechange = test.step_func(function() {
            assert_equals(client.response, "", "response data")
            assert_equals(client.status, code, "response status")

            if (client.readyState == client.DONE)
              // Give extra time for a bogus error event to pop up
              test.step_timeout(() => { test.done() }, 100)
          })
          client.onerror = test.step_func(function() {
            assert_unreached("HTTP error should not throw error event")
          })
          client.send()
        })
      }

      function unknownScheme() {
        test(() => {
          var client = new XMLHttpRequest();
          client.open("GET", "foobar://dummy", false);
          try {
            client.send();
          } catch(ex) {}
          assert_equals(client.status, 0, "response data");
        }, "Unknown scheme");
      }

      function postOnBlob() {
        test(() => {
          var u = URL.createObjectURL(new Blob([""], {type: 'text/plain'}));
          var client = new XMLHttpRequest();
          client.open("POST", u, false);
          try {
            client.send();
          } catch(ex) {}
          assert_equals(client.status, 0, "response data");
        }, "POST on blob uri");
      }

      noError('GET', 200)
      noError('GET', 400)
      noError('GET', 401)
      noError('GET', 404)
      noError('GET', 410)
      noError('GET', 500)
      noError('GET', 699)

      noError('HEAD', 200)
      noError('HEAD', 404)
      noError('HEAD', 500)
      noError('HEAD', 699)

      noError('POST', 200)
      noError('POST', 404)
      noError('POST', 500)
      noError('POST', 699)

      noError('PUT', 200)
      noError('PUT', 404)
      noError('PUT', 500)
      noError('PUT', 699)

      unknownScheme();
      postOnBlob();
    </script>
  </body>
</html>

 *
 * status-error.htm
 */
