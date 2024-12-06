import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	let expected = ['a1', 'b1', 'c1', 'a2', 'b2', 'c2', 'a3', 'c3', 'a4', 'c4'];
	let result = [];

	xhr.onreadystatechange = () => {
		result.push('a' + xhr.readyState);
	};

	let callback;

	xhr.addEventListener('readystatechange', callback = () => {
		result.push('b' + xhr.readyState)

		if(xhr.readyState === xhr.LOADING)
			assert(false);
	});

	xhr.addEventListener('readystatechange', () => {
		result.push('c' + xhr.readyState);

		if(xhr.readyState === xhr.HEADERS_RECEIVED)
			xhr.removeEventListener('readystatechange', callback);

		if(xhr.readyState === xhr.DONE)
			assert.deepStrictEqual(result, expected);
	});

	xhr.open('GET', `${activeURL.replace('/resources', '') + '/folder.txt'}`);
	xhr.send();
}

/*
 * xmlhttprequest-eventtarget.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: implements EventTarget</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#xmlhttprequesteventtarget" data-tested-assertations=".." />
    <!-- Obviously, most of the stuff actually being tested here is covered in the DOM events spec, not in the XHR spec -->
  </head>
  <body>
    <div id="log"></div>
    <script>
      var test = async_test(),
          x = null,
          expected = ["a1", "b1", "c1", "a2", "b2", "c2", "a3", "c3", "a4", "c4"],
          result = []
      function callback(e) {
        result.push("b" + x.readyState)
        test.step(function() {
          if(x.readyState == 3)
            assert_unreached()
        })
      }
      test.step(function() {
        x = new XMLHttpRequest()
        x.onreadystatechange = function() {
          test.step(function() {
            result.push("a" + x.readyState)
          })
        }
        x.addEventListener("readystatechange", callback, false)
        x.addEventListener("readystatechange", function() {
          test.step(function() {
            result.push("c" + x.readyState)
            if(x.readyState == 2)
              x.removeEventListener("readystatechange", callback, false)
            if(x.readyState == 4) {
              assert_array_equals(result, expected)
              test.done()
            }
          })
        }, false)
        x.open("GET", "folder.txt")
        x.send(null)
      })
    </script>
  </body>
</html>

 *
 * xmlhttprequest-eventtarget.htm
 */
