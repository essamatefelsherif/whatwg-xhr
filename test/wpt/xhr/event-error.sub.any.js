import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';
import { ProgressEvent } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	(() => {
		const xhr  = new XMLHttpRequest();

		xhr.onerror = (e) => {
			assert(e instanceof ProgressEvent);
			assert.strictEqual(e.type, 'error');
			xhr.onerror = null;
		};

		xhr.open('GET', `http://nonexistent`);
		xhr.send();
	})();

	(() => {
		const xhr  = new XMLHttpRequest();

		xhr.open('GET', `${activeURL}/bad-chunk-encoding.py`);

		xhr.addEventListener('load', () => {
			assert(false, 'unreached code');
		});

		xhr.addEventListener('error', (e) => {
			assert.strictEqual(e.loaded, 0, 'loaded');
			assert.strictEqual(e.total,  0, 'total');
		});

		xhr.addEventListener('loadend', (e) => {
			assert.strictEqual(e.loaded, 0, 'loaded');
			assert.strictEqual(e.total,  0, 'total');
		});

		xhr.send();
	})();
}

/*
 * event-error.sub.any.js
 *

// META: title=XMLHttpRequest Test: event - error

async_test(function(t) {
  var client = new XMLHttpRequest();
  client.onerror = t.step_func(function (e) {
    assert_true(e instanceof ProgressEvent);
    assert_equals(e.type, "error");
    t.done();
  });

  client.open('GET', 'http://nonexistent.{{host}}:{{ports[http][0]}}');
  client.send('null');
}, 'onerror should be called');

async_test((t) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'resources/bad-chunk-encoding.py');
  xhr.addEventListener('load', t.unreached_func('load'));
  xhr.addEventListener('error', t.step_func((e) => {
    assert_equals(e.loaded, 0, 'loaded');
    assert_equals(e.total, 0, 'total');
  }));
  xhr.addEventListener('loadend', t.step_func_done((e) => {
    assert_equals(e.loaded, 0, 'loaded');
    assert_equals(e.total, 0, 'total');
  }));
  xhr.send();
}, 'error while reading body should report zeros for loaded and total');

 *
 * event-error.sub.any.js
 */
