import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	var xhr = new XMLHttpRequest();

	xhr.open('GET', `${activeURL}/content.py?\u00DF`, false);

	xhr.send();

	assert.strictEqual(xhr.getResponseHeader('x-request-query'), '%DF');

	var xhr = new XMLHttpRequest();

	xhr.open('GET', `${activeURL}/content.py?\uD83D`, false);
	xhr.send();

	assert.strictEqual(xhr.getResponseHeader('x-request-query'), '%26%2365533%3B');
}
﻿
/*
 * open-url-encoding.htm
 *

<!DOCTYPE html>
<html>
  <head>
    <meta charset=windows-1252>
    <title>XMLHttpRequest: open() - URL encoding</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
  </head>
  <body>
    <div id="log"></div>
    <script>
      test(function() {
        var client = new XMLHttpRequest()
        client.open("GET", "resources/content.py?\u00DF", false) // This is the German "eszett" character
        client.send()
        assert_equals(client.getResponseHeader("x-request-query"), "%DF")
      }, "percent encode characters");
      test(function() {
        var client = new XMLHttpRequest()
        client.open("GET", "resources/content.py?\uD83D", false)
        client.send()
        assert_equals(client.getResponseHeader("x-request-query"), "%26%2365533%3B");
      }, "lone surrogate");
    </script>
  </body>
</html>

 *
 * open-url-encoding.htm
 */
