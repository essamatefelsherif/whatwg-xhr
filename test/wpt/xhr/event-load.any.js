import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';
import { ProgressEvent  } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr  = new XMLHttpRequest();
	let timeout;

	xhr.onload = (e) => {

		assert(e instanceof ProgressEvent);
		assert.strictEqual(e.type, 'load');
		assert.strictEqual(xhr.readyState, 4);

		xhr.onload = null;
		xhr.onreadystatechange = null;

		clearTimeout(timeout);
	};

	xhr.onreadystatechange = () => {
		if(xhr.readyState !== 4){
			return;
		}

		timeout = setTimeout(() => {
			assert(false, "Didn't get load event within 4ms of readystatechange==4");
		}, 4);
	};

	xhr.open('GET', `${activeURL}/well-formed.xml`);
	xhr.send();
}

/*
 * event-load.any.js
 *

// META: title=XMLHttpRequest: The send() method: Fire an event named load (synchronous flag is unset)

var test = async_test();
test.step(function () {
  var client = new XMLHttpRequest();
  client.onload = test.step_func(function (e) {
    assert_true(e instanceof ProgressEvent);
    assert_equals(e.type, "load");
    assert_equals(client.readyState, 4);
    test.done();
  });
  client.onreadystatechange = test.step_func(function () {
    if (client.readyState !== 4) return;

    test.step_timeout(() => {
      assert_unreached("Didn't get load event within 4ms of readystatechange==4");
    }, 4);
  });
  client.open("GET", "resources/well-formed.xml");
  client.send(null);
});

 *
 * event-load.any.js
 */
