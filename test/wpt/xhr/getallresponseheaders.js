import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	xhr.onload = () => {
	    assert.strictEqual(xhr.getAllResponseHeaders(), 'also-here: Mr. PB\r\newok: lego\r\nfoo-test: 1, 2\r\n__custom: token\r\n');
	};

	xhr.onerror = (e) => {
		assert(false, `unexpected error`);
	};

	xhr.open('GET', `${activeURL}/headers.asis`);
	xhr.send();

	const tests = [
		['content-length',   '0',                        'header-content-length'],
		['content-length',   '0, 0',                     'header-content-length-twice'],
		['double-trouble',   ',',                        'headers-double-empty'],
		['foo-test',         '1, 2, 3',                  'headers-basic'],
		['heya',             ', \u000B\u000C, 1, , , 2', 'headers-some-are-empty'],
		['www-authenticate', '1, 2, 3, 4',               'headers-www-authenticate'],
	];

	tests.forEach(testValues => {

		const xhr = new XMLHttpRequest();

		xhr.onload = () => {
			assert.strictEqual(xhr.getAllResponseHeaders(), testValues[0] + ': ' + testValues[1] + '\r\n');
		};

		xhr.onerror = () => {
			assert(false, 'unexpected error');
		};

		xhr.open('GET', `${activeURL}/${testValues[2]}.asis`);
		xhr.send();
	});

}
﻿
/*
 * getallresponseheaders.htm
 *

<!doctype html>
<title>XMLHttpRequest: getAllResponseHeaders()</title>
<script src=/resources/testharness.js></script>
<script src=/resources/testharnessreport.js></script>
<div id="log"></div>
<script>
async_test((t) => {
  const client = new XMLHttpRequest()
  client.onload = t.step_func_done(() => {
    assert_equals(client.getAllResponseHeaders(), "also-here: Mr. PB\r\newok: lego\r\nfoo-test: 1, 2\r\n__custom: token\r\n")
  })
  client.onerror = t.unreached_func("unexpected error")
  client.open("GET", "resources/headers.asis")
  client.send(null)
});

[
  ["content-length", "0", "header-content-length"],
  ["content-length", "0, 0", "header-content-length-twice"],
  ["double-trouble", ", ", "headers-double-empty"],
  ["foo-test", "1, 2, 3", "headers-basic"],
  ["heya", ", \u000B\u000C, 1, , , 2", "headers-some-are-empty"],
  ["www-authenticate", "1, 2, 3, 4", "headers-www-authenticate"],
].forEach(testValues => {
  async_test(t => {
    const client = new XMLHttpRequest();
    client.onload = t.step_func_done(() => {
      assert_equals(client.getAllResponseHeaders(), testValues[0] + ": " + testValues[1] + "\r\n");
    });
    client.onerror = t.unreached_func("unexpected error");
    client.open("GET", "resources/" + testValues[2] + ".asis");
    client.send();
  });
});
</script>

 *
 * getallresponseheaders.htm
 */
