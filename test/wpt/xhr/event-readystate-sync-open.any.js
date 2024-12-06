import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	(() => {
		const xhr = new XMLHttpRequest();
		const eventsFired = [];

		xhr.onreadystatechange = () => {
			eventsFired.push(xhr.readyState);
		};

		xhr.open('GET', `${activeURL}/...`, false);
		assert.deepStrictEqual(eventsFired, [1]);
	})();

	(() => {
		const xhr = new XMLHttpRequest();
		const eventsFired = [];

		xhr.onreadystatechange = () => {
			eventsFired.push(xhr.readyState);
		};

		xhr.open('GET', `${activeURL}/...`, true);
		assert.deepStrictEqual(eventsFired, [1]);
	})();
}

/*
 * event-readystate-sync-open.any.js
 *

// META: title=XMLHttpRequest: open() call fires sync readystate event

const title = "XMLHttpRequest: open() call fires sync readystate event";

test(function () {
  var client = new XMLHttpRequest()
  var eventsFired = []
  client.onreadystatechange = function () {
    eventsFired.push(client.readyState)
  }
  client.open('GET', "...", false)
  assert_array_equals(eventsFired, [1])
}, title + ' (sync)');

test(function () {
  var client = new XMLHttpRequest()
  var eventsFired = []
  client.onreadystatechange = function () {
    eventsFired.push(client.readyState)
  }
  client.open('GET', "...", true)
  assert_array_equals(eventsFired, [1])
}, title + ' (async)');

 *
 * event-readystate-sync-open.any.js
 */
