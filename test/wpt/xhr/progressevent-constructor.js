import assert from 'node:assert/strict';
import { ProgressEvent } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	(() => {
		let ev = new ProgressEvent('test');

			assert.strictEqual(ev.type,             'test');
			assert.strictEqual(ev.target,           null);
			assert.strictEqual(ev.currentTarget,    null);
			assert.strictEqual(ev.eventPhase,       Event.NONE);
			assert.strictEqual(ev.bubbles,          false);
			assert.strictEqual(ev.cancelable,       false);
			assert.strictEqual(ev.defaultPrevented, false);
			assert.strictEqual(ev.isTrusted,        false);

			assert(ev.timeStamp > 0);
			// assert('initEvent' in ev);

			assert.strictEqual(ev.lengthComputable, false);
			assert.strictEqual(ev.loaded, 0);
			assert.strictEqual(ev.total,  0);

	})('Default event values');

	(() => {
		let ev = new ProgressEvent('test');

		assert.strictEqual(ev['initProgressEvent'], undefined);
	})('There must not be a initProgressEvent()');

	(() => {
		let ev = new ProgressEvent('I am an event', { type: 'trololol', bubbles: true, cancelable: false});

		assert.strictEqual(ev.type,       'I am an event');
		assert.strictEqual(ev.bubbles,    true);
		assert.strictEqual(ev.cancelable, false);

	})('Basic test');

	(() => {
		let ev = new ProgressEvent(null, {lengthComputable: 'hah', loaded: '2' });

		assert.strictEqual(ev.type,             'null');
		assert.strictEqual(ev.lengthComputable, true);
		assert.strictEqual(ev.loaded,           2);

	})('ECMAScript value conversion test.');

	(() => {
		let ev = new ProgressEvent('Xx', {lengthcomputable: true});

		assert.strictEqual(ev.type,             'Xx');
		assert.strictEqual(ev.lengthComputable, false);

	})('ProgressEventInit members must be matched case-sensitively.');
}
﻿
/*
 * progressevent-constructor.html
 *

<!doctype html>
<title>ProgressEvent constructor</title>
<link rel="help" href="https://xhr.spec.whatwg.org/#interface-progressevent">
<link rel="help" href="https://dom.spec.whatwg.org/#concept-event-constructor">
<link rel="help" href="https://dom.spec.whatwg.org/#interface-event">
<script src=/resources/testharness.js></script>
<script src=/resources/testharnessreport.js></script>
<div id=log></div>
<script>
test(function() {
  var ev = new ProgressEvent("test")
  assert_equals(ev.type, "test")
  assert_equals(ev.target, null)
  assert_equals(ev.currentTarget, null)
  assert_equals(ev.eventPhase, Event.NONE)
  assert_equals(ev.bubbles, false)
  assert_equals(ev.cancelable, false)
  assert_equals(ev.defaultPrevented, false)
  assert_equals(ev.isTrusted, false)
  assert_true(ev.timeStamp > 0)
  assert_true("initEvent" in ev)
  assert_equals(ev.lengthComputable, false)
  assert_equals(ev.loaded, 0)
  assert_equals(ev.total, 0)
}, "Default event values.")
test(function() {
  var ev = new ProgressEvent("test")
  assert_equals(ev["initProgressEvent"], undefined)
}, "There must not be a initProgressEvent().")
test(function() {
  var ev = new ProgressEvent("I am an event", { type: "trololol", bubbles: true, cancelable: false})
  assert_equals(ev.type, "I am an event")
  assert_equals(ev.bubbles, true)
  assert_equals(ev.cancelable, false)
}, "Basic test.")
test(function() {
  var ev = new ProgressEvent(null, { lengthComputable: "hah", loaded: "2" })
  assert_equals(ev.type, "null")
  assert_equals(ev.lengthComputable, true)
  assert_equals(ev.loaded, 2)
}, "ECMAScript value conversion test.")
test(function() {
  var ev = new ProgressEvent("Xx", { lengthcomputable: true})
  assert_equals(ev.type, "Xx")
  assert_equals(ev.lengthComputable, false)
}, "ProgressEventInit members must be matched case-sensitively.")
</script>

 *
 * progressevent-constructor.html
 */
