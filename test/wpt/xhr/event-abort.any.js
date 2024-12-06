import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr  = new XMLHttpRequest();
	let timeout;

	xhr.onabort = () => {
		clearTimeout(timeout);
	};

	xhr.open('GET', `${activeURL}/well-formed.xml`);
	xhr.send();

	timeout = setTimeout(() => {
		assert(false, 'onabort not called after 4 ms.');
	}, 4);

	xhr.abort();
}

/*
 * event-abort.any.js
 *

// META: title=XMLHttpRequest: abort event

var test = async_test();
test.step(function () {
  var client = new XMLHttpRequest();
  client.onabort = test.step_func(function () {
    test.done();
  });
  client.open("GET", "resources/well-formed.xml");
  client.send(null);
  client.abort();
  test.step_timeout(() => {
    assert_unreached("onabort not called after 4 ms");
  }, 4);
});

 *
 * event-abort.any.js
 */
