import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr  = new XMLHttpRequest();
	let timeout;

	xhr.ontimeout = () => {
		assert.strictEqual(xhr.readyState, 4);
		xhr.ontimeout = null;
		clearTimeout(timeout);
	};

	xhr.timeout = 5;
	xhr.open('GET', `${activeURL}/delay.py?ms=20000`);
	xhr.send();

	timeout = setTimeout(() => {
		assert(false, 'ontimeout not called.');
	}, 1000);
}

/*
 * event-timeout.any.js
 *
// META: title=XMLHttpRequest: timeout event

var test = async_test();
test.step(function () {
  var client = new XMLHttpRequest();
  client.ontimeout = function () {
    test.step(function () {
      assert_equals(client.readyState, 4);
      test.done();
    });
  };
  client.timeout = 5;
  client.open("GET", "resources/delay.py?ms=20000");
  client.send(null);
  test.step_timeout(() => {
    assert_unreached("ontimeout not called.");
  }, 1000);
});

 *
 * event-timeout.any.js
 */
