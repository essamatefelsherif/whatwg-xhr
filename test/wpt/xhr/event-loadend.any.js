import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';
import { ProgressEvent  } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr  = new XMLHttpRequest();
	let timeout;

	xhr.onloadend = (e) => {

		assert(e instanceof ProgressEvent);
		assert.strictEqual(e.type, 'loadend');

		xhr.onloadend = null;
		xhr.onreadystatechange = null;

		clearTimeout(timeout);
	};

	xhr.onreadystatechange = () => {
		if(xhr.readyState !== 4){
			return;
		}

		timeout = setTimeout(() => {
			assert(false, 'onloadend not called after 100 ms');
		}, 100);
	};

	xhr.open('GET', `${activeURL}/well-formed.xml`);
	xhr.send();
}

/*
 * event-loadend.any.js
 *

// META: title=XMLHttpRequest: loadend event

var test = async_test();
test.step(function () {
  var client = new XMLHttpRequest();
  client.onloadend = test.step_func(function (e) {
    assert_true(e instanceof ProgressEvent);
    assert_equals(e.type, "loadend");
    test.done();
  });
  client.onreadystatechange = function () {
    if (client.readyState !== 4) return;
    test.step_timeout(() => {
      assert_unreached("onloadend not called after 100 ms");
    }, 100);
  };
  client.open("GET", "resources/well-formed.xml");
  client.send(null);
});

 *
 * event-loadend.any.js
 */
