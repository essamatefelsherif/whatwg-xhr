import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	var xhr = new XMLHttpRequest();

	xhr.open('GET', `${activeURL}/inspect-headers.py?filter_name=accept-language`, false);
	xhr.send();
	assert( /Accept-Language:\s.+/i.test(xhr.responseText) );

	var xhr = new XMLHttpRequest();

	xhr.open('GET', `${activeURL}/inspect-headers.py?filter_name=accept-language`, false);
	xhr.setRequestHeader('Accept-Language', 'x-GameSpeak');
	xhr.send();
	assert.strictEqual(xhr.responseText, 'Accept-Language: x-GameSpeak\n');
}
﻿
/*
 * send-accept-language.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: send() - Accept-Language</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-send()-method">
  </head>
  <body>
    <div id="log"></div>
    <script>
      test(function() {
        var client = new XMLHttpRequest()
        client.open('GET', 'resources/inspect-headers.py?filter_name=accept-language', false)
        client.send(null)
        assert_regexp_match(client.responseText, /Accept-Language:\s.+/)
      }, 'Send "sensible" default value, whatever that means')
      test(function() {
        var client = new XMLHttpRequest()
        client.open("GET", "resources/inspect-headers.py?filter_name=accept-language", false)
        client.setRequestHeader("Accept-Language", "x-GameSpeak")
        client.send(null)
        assert_equals(client.responseText, "Accept-Language: x-GameSpeak\n")
      })
    </script>
  </body>
</html>

 *
 * send-accept-language.htm
 */
