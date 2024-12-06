import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	try_value('t\x00t');
	try_value('t\rt');
	try_value('t\nt');

	(() => {
		const xhr = new XMLHttpRequest();

		xhr.open('GET', `${activeURL}/...`);

		assert.throws(
			() => {
				xhr.setRequestHeader('x-test', 'ﾃｽﾄ');
			},
			(err) => {
				assert(err instanceof TypeError, 'TypeError expected');

				return true;
			}
		);
	})();

	(() => {
		const xhr = new XMLHttpRequest();

		xhr.open('GET', `${activeURL}/...`);

		assert.throws(
			() => {
				xhr.setRequestHeader('x-test');
			},
			(err) => {
				assert(err instanceof TypeError, 'TypeError expected');

				return true;
			}
		);
	})();

	function try_value(value){
		const xhr = new XMLHttpRequest();

		xhr.open('GET', `${activeURL}/...`);

		assert.throws(
			() => {
				xhr.setRequestHeader('x-test', value);
			},
			(err) => {
				assert(err instanceof DOMException, 'DOMException expected');
				assert(err.name === 'SyntaxError', 'SyntaxError expected');

				return true;
			}
		);
	}
}
﻿
/*
 * setrequestheader-bogus-value.htm
 *

<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>XMLHttpRequest: setRequestHeader() value argument checks</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-setrequestheader()-method" data-tested-assertations="/following::ol/li[4]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      function try_value(value) {
        test(function() {
          var client = new XMLHttpRequest();
          client.open("GET", "...");
          assert_throws_dom("SyntaxError", function() { client.setRequestHeader("x-test", value) }, ' given value ' + value+', ');
        });
      }
      try_value("t\x00t");
      try_value("t\rt");
      try_value("t\nt");
      test(function() {
        var client = new XMLHttpRequest();
        client.open("GET", "...");
        assert_throws_js(TypeError, function() { client.setRequestHeader("x-test", "ﾃｽﾄ") }, ' given value ﾃｽﾄ,');
      });

      test(function() {
        var client = new XMLHttpRequest()
        client.open("GET", "...")
        assert_throws_js(TypeError, function() { client.setRequestHeader("x-test") })
      }, 'Omitted value argument')
    </script>
  </body>
</html>

 *
 * setrequestheader-bogus-value.htm
 */
