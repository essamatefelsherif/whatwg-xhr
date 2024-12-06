import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	request('arraybuffer');
	request('blob');
	request('json');
	request('text');
	request('document');

	function request(type){

		let xhr = new XMLHttpRequest;

		xhr.onreadystatechange = () => {
			assert(false, 'No events should fire here');
		};

		xhr.responseType = type;

		assert.throws(
			() => {
				xhr.open('GET', `${activeURL}/...`, false);
			},
			(err) => {
				assert(err instanceof DOMException, 'DOMException expected');
				assert(err.name === 'InvalidAccessError', 'InvalidAccessError expected');

				return true;
			}
		);
	}
}
﻿
/*
 * open-method-responsetype-set-sync.htm
 *

<!DOCTYPE html>
<html>
  <head>
    <title>XMLHttpRequest: open() sync request not allowed if responseType is set</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-open()-method" data-tested-assertations="following::ol[1]/li[10]" />

  </head>
  <body>
    <div id="log"></div>
    <script>
      // Note: the case of calling synchronous open() first, and then setting
      // responseType, is tested in responsetype.html.
      function request(type) {
        test(function() {
          var client = new XMLHttpRequest()
          client.onreadystatechange = this.step_func(function(){
            assert_unreached('No events should fire here')
          })
          client.responseType = type
          assert_throws_dom("InvalidAccessError", function() { client.open('GET', "...", false) })
        }, document.title + " (" + type + ")")
      }
      request("arraybuffer")
      request("blob")
      request("json")
      request("text")
      request("document")
    </script>
  </body>
</html>

 *
 * open-method-responsetype-set-sync.htm
 */
