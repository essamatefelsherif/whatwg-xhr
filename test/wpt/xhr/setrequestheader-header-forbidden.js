import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	xhr.open('POST', `${activeURL}/inspect-headers.py?filter_value=TEST`, false);

	xhr.setRequestHeader('Accept-Charset', 'TEST');
	xhr.setRequestHeader('Accept-Encoding', 'TEST');
	xhr.setRequestHeader('Connection', 'TEST');
	xhr.setRequestHeader('Content-Length', 'TEST');
	xhr.setRequestHeader('Cookie', 'TEST');
	xhr.setRequestHeader('Cookie2', 'TEST');
	xhr.setRequestHeader('Date', 'TEST');
	xhr.setRequestHeader('DNT', 'TEST');
	xhr.setRequestHeader('Expect', 'TEST');
	xhr.setRequestHeader('Host', 'TEST');
	xhr.setRequestHeader('Keep-Alive', 'TEST');
	xhr.setRequestHeader('Referer', 'TEST');
	xhr.setRequestHeader('TE', 'TEST');
	xhr.setRequestHeader('Trailer', 'TEST');
	xhr.setRequestHeader('Transfer-Encoding', 'TEST');
	xhr.setRequestHeader('Upgrade', 'TEST');
	xhr.setRequestHeader('Via', 'TEST');
	xhr.setRequestHeader('Proxy-', 'TEST');
	xhr.setRequestHeader('Proxy-LIES', 'TEST');
	xhr.setRequestHeader('Proxy-Authorization', 'TEST');
	xhr.setRequestHeader('Sec-', 'TEST');
	xhr.setRequestHeader('Sec-X', 'TEST');

	xhr.send();
	assert.strictEqual(xhr.responseText, '');

	let forbiddenMethods = [
		'TRACE',
		'TRACK',
		'CONNECT',
		'trace',
		'track',
		'connect',
		'trace,',
		'GET,track ',
		' connect',
	];

	let overrideHeaders = [
		'x-http-method-override',
		'x-http-method',
		'x-method-override',
		'X-HTTP-METHOD-OVERRIDE',
		'X-HTTP-METHOD',
		'X-METHOD-OVERRIDE',
	];

	for (let forbiddenMethod of forbiddenMethods) {
		for (let overrideHeader of overrideHeaders) {
			let xhr = new XMLHttpRequest();

			xhr.open('POST',
				`${activeURL}/inspect-headers.py?filter_name=${forbiddenMethod}`, false);

			xhr.setRequestHeader(overrideHeader, forbiddenMethod);
			xhr.send();

			assert.strictEqual(xhr.responseText, '');
		}
	}

	let permittedValues = [
		'GETTRACE',
		'GET',
		'\",TRACE\",',
	];

	for (let permittedValue of permittedValues) {
		 for (let overrideHeader of overrideHeaders) {
			let xhr = new XMLHttpRequest();

			xhr.open('POST',
				`${activeURL}/inspect-headers.py?filter_name=${overrideHeader}`, false);

			xhr.setRequestHeader(overrideHeader, permittedValue);
			xhr.send();

			assert.strictEqual(xhr.responseText, `${overrideHeader}: ${permittedValue}\n`);
		}
	}
}

/*
 * setrequestheader-header-forbidden.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: setRequestHeader() - headers that are forbidden</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-setrequestheader()-method">

  </head>
  <body>
    <div id="log"></div>
    <script>
      test(function() {
        var client = new XMLHttpRequest()
        client.open("POST", "resources/inspect-headers.py?filter_value=TEST", false)
        client.setRequestHeader("Accept-Charset", "TEST")
        client.setRequestHeader("Accept-Encoding", "TEST")
        client.setRequestHeader("Connection", "TEST")
        client.setRequestHeader("Content-Length", "TEST")
        client.setRequestHeader("Cookie", "TEST")
        client.setRequestHeader("Cookie2", "TEST")
        client.setRequestHeader("Date", "TEST")
        client.setRequestHeader("DNT", "TEST")
        client.setRequestHeader("Expect", "TEST")
        client.setRequestHeader("Host", "TEST")
        client.setRequestHeader("Keep-Alive", "TEST")
        client.setRequestHeader("Referer", "TEST")
        client.setRequestHeader("TE", "TEST")
        client.setRequestHeader("Trailer", "TEST")
        client.setRequestHeader("Transfer-Encoding", "TEST")
        client.setRequestHeader("Upgrade", "TEST")
        client.setRequestHeader("Via", "TEST")
        client.setRequestHeader("Proxy-", "TEST")
        client.setRequestHeader("Proxy-LIES", "TEST")
        client.setRequestHeader("Proxy-Authorization", "TEST")
        client.setRequestHeader("Sec-", "TEST")
        client.setRequestHeader("Sec-X", "TEST")
        client.send(null)
        assert_equals(client.responseText, "")
        })

        test (function() {

        let forbiddenMethods = [
          "TRACE",
          "TRACK",
          "CONNECT",
          "trace",
          "track",
          "connect",
          "trace,",
          "GET,track ",
          " connect",
        ];

        let overrideHeaders = [
          "x-http-method-override",
          "x-http-method",
          "x-method-override",
          "X-HTTP-METHOD-OVERRIDE",
          "X-HTTP-METHOD",
          "X-METHOD-OVERRIDE",
        ];

        for (forbiddenMethod of forbiddenMethods) {
          for (overrideHeader of overrideHeaders) {
             var client = new XMLHttpRequest()
             client.open("POST",
                     `resources/inspect-headers.py?filter_value=${forbiddenMethod}`, false)
             client.setRequestHeader(overrideHeader, forbiddenMethod)
             client.send(null)
             assert_equals(client.responseText, "")
          }
        }

        let permittedValues = [
        "GETTRACE",
        "GET",
        "\",TRACE\",",
        ];

        for (permittedValue of permittedValues) {
          for (overrideHeader of overrideHeaders) {
             var client = new XMLHttpRequest()
             client.open("POST",
                     `resources/inspect-headers.py?filter_name=${overrideHeader}`, false)
             client.setRequestHeader(overrideHeader, permittedValue)
             client.send(null)
             assert_equals(client.responseText, overrideHeader + ": " + permittedValue + "\n")
          }
        }
      })
    </script>
  </body>
</html>

 *
 * setrequestheader-header-forbidden.htm
 */
