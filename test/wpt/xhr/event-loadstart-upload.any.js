import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';
import { ProgressEvent  } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr  = new XMLHttpRequest();
	let timeout;

	xhr.upload.onloadstart = (e) => {

		assert(e instanceof ProgressEvent);

		assert.strictEqual(e.type, 'loadstart');
		assert.strictEqual(e.total,  7, 'upload.onloadstart: event.total');
		assert.strictEqual(e.loaded, 0, 'upload.onloadstart: event.loaded');

		xhr.onreadystatechange = null;
	};

	xhr.onreadystatechange = () => {
		if(xhr.readyState === 4)
			assert(false, 'onloadstart not called.');
	};

	xhr.open('POST', `${activeURL}/trickle.py?ms=5&count=8`);
	xhr.send('foo=bar');
}

/*
 * event-loadstart-upload.any.js
 *

// META: title=XMLHttpRequest: The send() method: Fire a progress event named loadstart on upload object (synchronous flag is unset)

var test = async_test();
test.step(function () {
  var client = new XMLHttpRequest();
  client.upload.onloadstart = test.step_func(function (e) {
    assert_true(e instanceof ProgressEvent);
    assert_equals(e.total, 7, 'upload.onloadstart: event.total');
    assert_equals(e.loaded, 0, 'upload.onloadstart: event.loaded');
    assert_equals(e.type, "loadstart");
    test.done();
  });
  client.onreadystatechange = test.step_func(function () {
    if (client.readyState === 4)
      assert_unreached("onloadstart not called.");
  });
  client.open("POST", "resources/trickle.py?ms=5&count=8");
  client.send('foo=bar');
});

 *
 * event-loadstart-upload.any.js
 */
