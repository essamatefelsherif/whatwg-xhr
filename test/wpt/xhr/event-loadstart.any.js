import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';
import { ProgressEvent  } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr  = new XMLHttpRequest();
	let timeout;

	xhr.onloadstart = (e) => {

		assert(e instanceof ProgressEvent);
		assert.strictEqual(e.type, 'loadstart');
		assert.strictEqual(xhr.readyState, 1);

		xhr.onloadstart = null;
		xhr.onreadystatechange = null;

		clearTimeout(timeout);
	};

	timeout = setTimeout(() => {
		assert(false, 'onloadstart not called after 500 ms');
	}, 500);

	xhr.open('GET', `${activeURL}/well-formed.xml`);
	xhr.send();
}

/*
 * event-loadstart.any.js
 *

// META: title=XMLHttpRequest: loadstart event

var test = async_test();
test.step(function () {
  var client = new XMLHttpRequest();
  client.onloadstart = test.step_func(function (e) {
    assert_true(e instanceof ProgressEvent);
    assert_equals(e.type, "loadstart");
    assert_equals(client.readyState, 1);
    test.done();
  });
  test.step_timeout(function () {
    assert_unreached("onloadstart not called after 500 ms");
  }, 500);
  client.open("GET", "resources/well-formed.xml");
  client.send(null);
});

 *
 * event-loadstart.any.js
 */
