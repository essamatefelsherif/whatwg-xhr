import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	let result = [];
	let expected = [1, 4, 1, 'hello'];

	xhr.open('GET', `data:text/plain`);
	result.push(xhr.readyState);

	xhr.send();

	xhr.onreadystatechange = () => {

		xhr.onreadystatechange = null;
		result.push(xhr.readyState);

		xhr.open('GET', `data:text/plain,hello`);

		xhr.onload = () => {
			result.push(xhr.responseText);
			assert.deepStrictEqual(result, expected);
		};

		xhr.send();
	};

	xhr.abort();
	result.push(xhr.readyState)  // surprise! should not be "unsent" even though we called abort()
}
﻿
/*
 * open-send-during-abort.htm
 *

<!doctype html>
<title>XMLHttpRequest: open() during abort()</title>
<script src="/resources/testharness.js"></script>
<script src="/resources/testharnessreport.js"></script>
<div id="log"></div>
<script>
async_test(t => {
  let result = [],
      client = new XMLHttpRequest(),
      expected = [1, 4, 1, 'hello']
  client.open("GET", "data:text/plain,")
  result.push(client.readyState)
  client.send()
  client.onreadystatechange = t.step_func(() => {
    client.onreadystatechange = null
    result.push(client.readyState)
    client.open("GET", "data:text/plain,hello")
    client.onload = t.step_func_done(() => {
      result.push(client.responseText)
      assert_array_equals(result, expected)
    })
    client.send()
  })
  client.abort()
  result.push(client.readyState)  // surprise! should not be "unsent" even though we called abort()
})
</script>

 *
 * open-send-during-abort.htm
 */
