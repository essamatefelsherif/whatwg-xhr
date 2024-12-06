import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = () => {
		if(xhr.readyState === 1){
			assert.strictEqual(xhr.getResponseHeader('x-custom-header'), null);
		}

		if(xhr.readyState > 1){
			assert.strictEqual(xhr.getResponseHeader('x-custom-header'), null);
		}

		if(xhr.readyState === 4){
			assert.strictEqual(xhr.getResponseHeader('x-custom-header'), null);
			assert(true);
		}
	};

	xhr.open('GET', `http://www.non-existent`);
	xhr.send();
}
﻿
/*
 * getresponseheader-error-state.htm
 *

<!DOCTYPE html>
<html>
  <head>
    <title>XMLHttpRequest: getResponseHeader() in error state (failing cross-origin test)</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#dom-xmlhttprequest-getresponseheader" data-tested-assertations="following::OL[1]/LI[2]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      var test = async_test()
      test.step(function() {

        var client = new XMLHttpRequest()
        client.onreadystatechange = function() {
          test.step(function() {
            if(client.readyState == 1) {
              assert_equals(client.getResponseHeader("x-custom-header"), null)
            }
            if(client.readyState > 1) {
              assert_equals(client.getResponseHeader("x-custom-header"), null)
            }
            if(client.readyState == 4){
              assert_equals(client.getResponseHeader("x-custom-header"), null)
              test.done()
            }
          })
        }
        var url = location.protocol + "//" + 'www1.' + location.host + (location.pathname.replace(/getresponseheader-error-state\.htm/, 'resources/nocors/folder.txt'))
        client.open("GET", url)
        client.send(null)
      })
  </script>
 </body>
</html>

 *
 * getresponseheader-error-state.htm
 */