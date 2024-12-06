import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	const xhr = new XMLHttpRequest();

	assert.strictEqual(xhr.responseType, '');

	xhr.onreadystatechange = () => {

		if(xhr.readyState === 1 || xhr.readyState === 2)
			assert.strictEqual(xhr.responseType, '');

		if(xhr.readyState === 3)
			xhr.onreadystatechange = null;
	};

	xhr.open('GET', `${activeURL}/headers.py`);
	xhr.send();
}
﻿
/*
 * responseText-status.html
 *

<!DOCTYPE html>
<meta charset="utf-8">
<title>XMLHttpRequest Test: responseText - status</title>
<link rel="author" title="Intel" href="http://www.intel.com">
<meta name="assert" content="Check if XMLHttpRequest.responseText return empty string if state is not LOADING or DONE">
<script src="/resources/testharness.js"></script>
<script src="/resources/testharnessreport.js"></script>

<div id="log"></div>

<script>

async_test(function (t) {
  var client = new XMLHttpRequest();
  t.step(function () {
    assert_equals(client.responseText, "");
  });

  client.onreadystatechange = t.step_func(function () {
    if (client.readyState == 1 || client.readyState == 2) {
      assert_equals(client.responseText, "");
    }

    if (client.readyState == 3) {
      t.done();
    }
  });

  client.open("GET", "resources/headers.py")
  client.send(null)
}, document.title);

</script>

 *
 * responseText-status.html
 */
