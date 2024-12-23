import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	const xhr = new XMLHttpRequest();

	xhr.onreadystatechange = () => {
		if(xhr.readyState !== 4)
			return;

		assert.strictEqual(xhr.responseText, 'テスト');
		xhr.onreadystatechange = null;
	};

		xhr.open('GET', `${activeURL}/status.py?type=${encodeURIComponent('text/html;charset=Shift-JIS')}&content=${encodeURIComponent('テスト')}`);
		xhr.overrideMimeType('text/plain;charset=UTF-8');
		xhr.send();
}
﻿
/*
 * overridemimetype-open-state-force-utf-8.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: overrideMimeType() in open state, enforcing UTF-8 encoding</title>
    <meta charset="utf-8">
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-overridemimetype()-method" data-tested-assertations="/following::ol/li[3] /following::ol/li[4]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      var test = async_test();
      test.step(function() {
        var client = new XMLHttpRequest();
        client.onreadystatechange = function() {
          if (client.readyState !== 4) return;
          assert_equals( client.responseText, 'テスト' );
          test.done();
        };
        client.open("GET", "resources/status.py?type="+encodeURIComponent('text/html;charset=Shift-JIS')+'&content='+encodeURIComponent('テスト'));
        client.overrideMimeType('text/plain;charset=UTF-8');
        client.send( '' );
      });
    </script>
  </body>
</html>

 *
 * overridemimetype-open-state-force-utf-8.htm
 */
