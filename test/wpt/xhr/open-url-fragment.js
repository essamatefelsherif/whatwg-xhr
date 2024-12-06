import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	var xhr = new XMLHttpRequest();

	xhr.open('GET', `${activeURL.replace('/resources', '') + '/folder.txt'}#foobar`, false);
	xhr.send();
	assert.strictEqual(xhr.responseText, 'top\n');

	var xhr = new XMLHttpRequest();

	xhr.open('GET', `${activeURL}/requri.py#foobar`, false);
	xhr.send();
	assert(/xhr\/resources\/requri\.py$/.test(xhr.responseText));

	var xhr = new XMLHttpRequest();

	xhr.open('GET', `${activeURL}/requri.py?help=#foobar`, false);
	xhr.send();
	assert(/xhr\/resources\/requri\.py\?help=$/.test(xhr.responseText));

	var xhr = new XMLHttpRequest();

	xhr.open('GET', `${activeURL}/requri.py?${encodeURIComponent("#foobar")}`, false);
	xhr.send();
	assert(/xhr\/resources\/requri\.py\?%23foobar$/.test(xhr.responseText));
}
﻿
/*
 * open-url-fragment.htm
 *

<!DOCTYPE html>
<html>
  <head>
    <title>XMLHttpRequest: open() resolving URLs - fragment identifier</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-open()-method" data-tested-assertations="following::ol[1]/li[7]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      test(function() {
        var client = new XMLHttpRequest()
        client.open("GET", "folder.txt#foobar", false)
        client.send(null)
        assert_equals(client.responseText, "top\n")
      })
      test(function() {
        var client = new XMLHttpRequest()
        client.open("GET", "resources/requri.py#foobar", false)
        client.send(null)
        assert_regexp_match(client.responseText, /xhr\/resources\/requri\.py$/)
      }, 'make sure fragment is removed from URL before request')
      test(function() {
        var client = new XMLHttpRequest()
        client.open("GET", "resources/requri.py?help=#foobar", false)
        client.send(null)
        assert_regexp_match(client.responseText, /xhr\/resources\/requri\.py\?help=$/)
      }, 'make sure fragment is removed from URL before request (with query string)')
      test(function() {
        var client = new XMLHttpRequest()
        client.open("GET", "resources/requri.py?" +encodeURIComponent("#foobar"), false)
        client.send(null)
        assert_regexp_match(client.responseText, /xhr\/resources\/requri\.py\?%23foobar$/)
      }, 'make sure escaped # is not removed')
    </script>
  </body>
</html>

 *
 * open-url-fragment.htm
 */
