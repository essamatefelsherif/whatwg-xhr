import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	(() => {
		var xhr = new XMLHttpRequest;

		xhr.onloadstart = () => {
			assert.throws(
				() => {
					xhr.setRequestHeader('General', 'Organa');
				},
				(err) => {
					assert(err instanceof DOMException, 'DOMException expected');
					assert(err.name === 'InvalidStateError', 'InvalidStateError expected');

					return true;
				}
			);
			assert.throws(
				() => {
					xhr.withCredentials = true;
				},
				(err) => {
					assert(err instanceof DOMException, 'DOMException expected');
					assert(err.name === 'InvalidStateError', 'InvalidStateError expected');

					return true;
				}
			);
			assert.throws(
				() => {
					xhr.send();
				},
				(err) => {
					assert(err instanceof DOMException, 'DOMException expected');
					assert(err.name === 'InvalidStateError', 'InvalidStateError expected');

					return true;
				}
			);

			xhr.onloadstart = null;

			xhr.open('GET', 'data:,BB-8');
			xhr.send();
		};

		xhr.onload = () => {
			assert.strictEqual(xhr.responseText, 'BB-8');
		};

		xhr.open('GET', 'data:,R2-D2');
		xhr.send();
	})();

	(() => {
		var xhr = new XMLHttpRequest;
		let abortFired = false;

		xhr.onloadstart = () => {
			assert.strictEqual(xhr.readyState, 1);
			xhr.abort();

			assert(abortFired);
			assert.strictEqual(xhr.readyState, 0);
		};

		xhr.onabort = () => {
			abortFired = true;
			assert.strictEqual(xhr.readyState, 4);
		};

		xhr.open('GET', 'data:,K-2SO');
		xhr.send();
	})();
}
﻿
/*
 * loadstart-and-state.html
 *

<!doctype html>
<title>XMLHttpRequest: loadstart event corner cases</title>
<script src=/resources/testharness.js></script>
<script src=/resources/testharnessreport.js></script>
<div id=log></div>
<script>
async_test(t => {
  const client = new XMLHttpRequest
  client.onloadstart = t.step_func(() => {
    assert_throws_dom("InvalidStateError", () => client.setRequestHeader("General", "Organa"))
    assert_throws_dom("InvalidStateError", () => client.withCredentials = true)
    assert_throws_dom("InvalidStateError", () => client.send())
    client.onloadstart = null
    client.open("GET", "data:,BB-8")
    client.send()
  })
  client.onload = t.step_func_done(() => {
    assert_equals(client.responseText, "BB-8")
  })
  client.open("GET", "data:,R2-D2")
  client.send()
}, "open() during loadstart")

async_test(t => {
  const client = new XMLHttpRequest
  let abortFired = false
  client.onloadstart = t.step_func_done(() => {
    assert_equals(client.readyState, 1)
    client.abort()
    assert_true(abortFired)
    assert_equals(client.readyState, 0)
  })
  client.onabort = t.step_func(() => {
    abortFired = true
    assert_equals(client.readyState, 4)
  })
  client.open("GET", "data:,K-2SO")
  client.send()
}, "abort() during loadstart")
</script>

 *
 * loadstart-and-state.html
 */
