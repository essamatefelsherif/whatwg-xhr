import assert from 'node:assert/strict';
import { ProgressEvent } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	(() => {
		assert.strictEqual(typeof ProgressEvent, 'function');
		assert.strictEqual(ProgressEvent.length, 1);
	})();

	(() => {
		let desc = Object.getOwnPropertyDescriptor(ProgressEvent, 'prototype');

		assert.strictEqual(desc.value, ProgressEvent.prototype);
		assert.strictEqual(desc.writable, false);
		assert.strictEqual(desc.enumerable, false);
		assert.strictEqual(desc.configurable, false);

		assert.throws(
			() => {
				'use strict';
				delete ProgressEvent.prototype;
			},
			(err) => {
				assert(err instanceof TypeError, 'TypeError expected');

				return true;
			}
		);

		assert.strictEqual(ProgressEvent.prototype.constructor, ProgressEvent);
		assert.strictEqual(Object.getPrototypeOf(ProgressEvent.prototype), Event.prototype);

	})('interface prototype object');

	let attributes = [
		['boolean', 'lengthComputable'],
		['unsigned long long', 'loaded'],
		['unsigned long long', 'total']
	];

	attributes.forEach((a) => {

		let desc = Object.getOwnPropertyDescriptor(ProgressEvent.prototype, a[1]);

		assert.strictEqual(desc.enumerable, true);
		assert.strictEqual(desc.configurable, true);

		assert.throws(
			() => {
				ProgressEvent.prototype[a[1]];
			},
			(err) => {
				assert(err instanceof TypeError, 'TypeError expected');

				return true;
			}
		);
	});

	(() => {
		for (var p in globalThis){
			assert(p !== 'ProgressEvent');
		}
	})('Interface objects properties should not be Enumerable');

	(() => {

		assert(!!ProgressEvent, 'Interface should exist.');
		// assert(delete globalThis.ProgressEvent, 'The delete operator should return true.');
		// assert.strictEqual(globalThis.ProgressEvent, undefined, 'Interface should be gone.');

	})('Should be able to delete ProgressEvent.');
}
﻿
/*
 * progressevent-interface.html
 *

<!DOCTYPE html>
<title>The ProgressEvent interface</title>
<script src="/resources/testharness.js"></script>
<script src="/resources/testharnessreport.js"></script>
<div id="log"></div>
<script>
test(function() {
  assert_equals(typeof ProgressEvent, "function")
  assert_equals(ProgressEvent.length, 1)
})
test(function() {
  var desc = Object.getOwnPropertyDescriptor(ProgressEvent, "prototype")
  assert_equals(desc.value, ProgressEvent.prototype)
  assert_equals(desc.writable, false)
  assert_equals(desc.enumerable, false)
  assert_equals(desc.configurable, false)
  assert_throws_js(TypeError, function() {
    "use strict";
    delete ProgressEvent.prototype;
  })
  assert_equals(ProgressEvent.prototype.constructor, ProgressEvent)
  assert_equals(Object.getPrototypeOf(ProgressEvent.prototype), Event.prototype)
}, "interface prototype object")
var attributes = [
  ["boolean", "lengthComputable"],
  ["unsigned long long", "loaded"],
  ["unsigned long long", "total"]
];
attributes.forEach(function(a) {
  test(function() {
    var desc = Object.getOwnPropertyDescriptor(ProgressEvent.prototype, a[1])
    assert_equals(desc.enumerable, true)
    assert_equals(desc.configurable, true)
    assert_throws_js(TypeError, function() {
      ProgressEvent.prototype[a[1]]
    })
  })
})
test(function() {
  for (var p in window) {
    assert_not_equals(p, "ProgressEvent")
  }
}, "Interface objects properties should not be Enumerable")
test(function() {
  assert_true(!!window.ProgressEvent, "Interface should exist.")
  assert_true(delete window.ProgressEvent, "The delete operator should return true.")
  assert_equals(window.ProgressEvent, undefined, "Interface should be gone.")
}, "Should be able to delete ProgressEvent.")
</script>

 *
 * progressevent-interface.html
 */
