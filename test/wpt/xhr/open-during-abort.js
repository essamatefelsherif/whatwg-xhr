import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	let result = [];
	let expected = [1, 4, 1]; // open() => 1, abort() => 4, open() => 1

	let abort_flag = false;

	xhr.onreadystatechange = () => {

		result.push(xhr.readyState);
		if(abort_flag){
			abort_flag = false;
			xhr.open('GET', `${activeURL}/...`);
		}
	};

	xhr.open('GET', `${activeURL}/well-formed.xml`);
	xhr.send();

	abort_flag = true;

	xhr.abort();

	assert.deepStrictEqual(result, expected);
	assert.strictEqual(xhr.readyState, 1, 'abort() should only set state to UNSENT when DONE');
}
﻿
/*
 * open-during-abort.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: open() during abort()</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
  </head>
  <body>
    <div id="log"></div>
    <script>
      test(function() {
        var client = new XMLHttpRequest(),
            abort_flag = false,
            result = [],
            expected = [1, 4, 1] // open() => 1, abort() => 4, open() => 1

        client.onreadystatechange = this.step_func(function() {
          result.push(client.readyState)
          if (abort_flag) {
            abort_flag = false
            client.open("GET", "...")
          }
        })
        client.open("GET", "resources/well-formed.xml")
        client.send(null)
        abort_flag = true
        client.abort()
        assert_array_equals(result, expected)
        assert_equals(client.readyState, 1) // abort() should only set state to UNSENT when DONE
      })
    </script>
  </body>
</html>

 *
 * open-during-abort.htm
 */
