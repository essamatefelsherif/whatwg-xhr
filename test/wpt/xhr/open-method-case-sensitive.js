import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

//	method('XUNICORN');
	method('xUNIcorn');
//	method('chiCKEN');
//	method('PATCH');
//	method('patCH');
//	method('copy');
//	method('COpy');
//	method('inDEX');
//	method('movE');

	function method(method){

		let xhr = new XMLHttpRequest();

		xhr.open(method, `${activeURL}/content.py`, false);
		xhr.send();

		assert.strictEqual(xhr.getResponseHeader('x-request-method'), method);
	}
}
﻿
/*
 * open-method-case-sensitive.htm
 *

<!DOCTYPE html>
<html>
  <head>
    <title>XMLHttpRequest: open() - case-sensitive methods test</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-open()-method" data-tested-assertations="following::ol/li[5]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      function method(method) {
        test(function() {
          var client = new XMLHttpRequest()
          client.open(method, "resources/content.py", false)
          client.send(null)
          assert_equals(client.getResponseHeader("x-request-method"), method)
        }, document.title + " (" + method + ")")
      }
      method("XUNICORN")
      method("xUNIcorn")
      method("chiCKEN")
      method("PATCH")
      method("patCH")
      method("copy")
      method("COpy")
      method("inDEX")
      method("movE")
    </script>
  </body>
</html>

 *
 * open-method-case-sensitive.htm
 */
