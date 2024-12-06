import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	const xhr = new XMLHttpRequest();

	let readyState2Reached = false;

	xhr.onreadystatechange = () => {
		if(xhr.readyState === 2){
			readyState2Reached = true;
			try{
				xhr.overrideMimeType('text/plain;charset=Shift-JIS');
			}catch(e){
				assert(false, 'overrideMimeType should not throw in state 2');
			}
		}

		if(xhr.readyState !== 4) return;

        assert.strictEqual( readyState2Reached, true, 'readyState = 2 event fired' );
        assert.strictEqual( xhr.responseText, 'テスト', 'overrideMimeType() in HEADERS RECEIVED state set encoding' );

		xhr.onreadystatechange = null;
	};

	xhr.open('GET', `${activeURL}/status.py?type=${encodeURIComponent('text/html;charset=UTF-8')}&content=%83%65%83%58%83%67`);
	xhr.send();
}
﻿
/*
 * overridemimetype-headers-received-state-force-shiftjis.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: overrideMimeType() in HEADERS RECEIVED state, enforcing Shift-JIS encoding</title>
    <meta charset="utf-8">
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-overridemimetype()-method" data-tested-assertations="/following::ol/li[1] /following::ol/li[4]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      var test = async_test();
      var client = new XMLHttpRequest();
      var readyState2Reached = false;
      client.onreadystatechange = test.step_func( function() {
        if(client.readyState===2){
          readyState2Reached = true;
          try{
            client.overrideMimeType('text/plain;charset=Shift-JIS');
          }catch(e){
            assert_unreached('overrideMimeType should not throw in state 2');
          }
        }
        if (client.readyState !== 4) return;
        assert_equals( readyState2Reached, true, "readyState = 2 event fired" );
        assert_equals( client.responseText, 'テスト', 'overrideMimeType() in HEADERS RECEIVED state set encoding' );
        test.done();
      });
      client.open("GET", "resources/status.py?type="+encodeURIComponent('text/html;charset=UTF-8')+'&content=%83%65%83%58%83%67');
      client.send( '' );
    </script>
  </body>
</html>

 *
 * overridemimetype-headers-received-state-force-shiftjis.htm
 */
