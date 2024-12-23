import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let client = new XMLHttpRequest();

	method('>');
	method('');
	method(' GET');
	method('G T');
	method('@GET');
	method('G:ET');
	method('GET?');
	method('GET\n');

	function method(method){
		assert.throws(
			() => {
				client.open(method, '...');
			},
			(err) => {
				assert(err instanceof DOMException, 'DOMException expected');
				assert(err.name === 'SyntaxError', 'SyntaxError expected');

				return true;
			}
		);
	}
}

/*
 * open-method-bogus.htm
 *

<!DOCTYPE html>
<html>
  <head>
    <title>XMLHttpRequest: open() - bogus methods</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-open()-method" data-tested-assertations="following::ol[1]/li[4]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      function method(method) {
        test(function() {
          var client = new XMLHttpRequest()
          assert_throws_dom("SyntaxError", function() { client.open(method, "...") })
        }, document.title + " (" + method + ")")
      }
      method("")
      method(">")
      method(" GET")
      method("G T")
      method("@GET")
      method("G:ET")
      method("GET?")
      method("GET\n")
    </script>
  </body>
</html>

 *
 * open-method-bogus.htm
 */
