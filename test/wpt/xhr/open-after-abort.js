import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

 	let result = [];
	let expected = [
		'readystatechange', 0, 1,  // open()
		'readystatechange', 2, 4,  // abort()
		'abort',            2, 4,  // abort()
		'loadend',          2, 4,  // abort()
		'readystatechange', 3, 1,  // open()
	];
	let state = 0;

	xhr.onreadystatechange = () => {
		result.push('readystatechange', state, xhr.readyState);
	};

	xhr.onabort = () => {
		// abort event must be fired synchronously from abort().
		assert(state === 2);

		// readystatechange should be fired before abort.
		assert.deepStrictEqual(
			result,
			[
				'readystatechange', 0, 1,  // open()
				'readystatechange', 2, 4,  // abort()
			]
		);

		// readyState should be set to unsent (0) at the very end of abort(),
		// after this (and onloadend) is called.
		assert(xhr.readyState === 4);

		result.push('abort', state, xhr.readyState);
	};

	xhr.onloadend = () => {

		// abort event must be fired synchronously from abort().
		assert(state === 2);

		// readystatechange should be fired before abort.
		assert.deepStrictEqual(
			result,
			[
				'readystatechange', 0, 1,  // open()
				'readystatechange', 2, 4,  // abort()
				'abort',            2, 4,  // abort()
			]
		);

		// readyState should be set to unsent (0) at the very end of abort(),
		// after this is called.
		assert(xhr.readyState, 4);

		result.push('loadend', state, xhr.readyState);
	};

	xhr.open('GET', `${activeURL}/well-formed.xml`);
	assert(xhr.readyState === 1);

	state = 1;
	xhr.send();

	state = 2;
	xhr.abort();
	assert(xhr.readyState === 0);

	state = 3;
	xhr.open('GET', `${activeURL}/well-formed.xml`);

	assert(xhr.readyState === 1);

	assert.deepStrictEqual(result, expected);
}
﻿
/*
 * open-after-abort.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: open() after abort()</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-open()-method" data-tested-assertations="following::ol/li[15] following::ol/li[15]/ol/li[1] following::ol/li[15]/ol/li[2]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      test(function(t) {
        var client = new XMLHttpRequest(),
            result = [],
            expected = [
              'readystatechange', 0, 1,  // open()
              'readystatechange', 2, 4,  // abort()
              'abort',            2, 4,  // abort()
              'loadend',          2, 4,  // abort()
              'readystatechange', 3, 1,  // open()
            ]

        var state = 0

        client.onreadystatechange = t.step_func(function() {
          result.push('readystatechange', state, client.readyState)
        })
        client.onabort = t.step_func(function() {
          // abort event must be fired synchronously from abort().
          assert_equals(state, 2)

          // readystatechange should be fired before abort.
          assert_array_equals(result, [
            'readystatechange', 0, 1,  // open()
            'readystatechange', 2, 4,  // abort()
          ])

          // readyState should be set to unsent (0) at the very end of abort(),
          // after this (and onloadend) is called.
          assert_equals(client.readyState, 4)

          result.push('abort', state, client.readyState)
        })
        client.onloadend = t.step_func(function() {
          // abort event must be fired synchronously from abort().
          assert_equals(state, 2)

          // readystatechange should be fired before abort.
          assert_array_equals(result, [
            'readystatechange', 0, 1,  // open()
            'readystatechange', 2, 4,  // abort()
            'abort',            2, 4,  // abort()
          ])

          // readyState should be set to unsent (0) at the very end of abort(),
          // after this is called.
          assert_equals(client.readyState, 4)

          result.push('loadend', state, client.readyState)
        })

        client.open("GET", "resources/well-formed.xml")
        assert_equals(client.readyState, 1)

        state = 1
        client.send(null)
        state = 2
        client.abort()
        assert_equals(client.readyState, 0)
        state = 3
        client.open("GET", "resources/well-formed.xml")
        assert_equals(client.readyState, 1)
        assert_array_equals(result, expected)
      })
    </script>
  </body>
</html>

 *
 * open-after-abort.htm
 */
