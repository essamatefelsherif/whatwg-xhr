import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	[
		'moz-blob',
		'moz-chunked-text',
		'moz-chunked-arraybuffer'
	].forEach((rt) => {

		let xhr = new XMLHttpRequest();
		xhr.responseType = rt;

		assert.strictEqual(xhr.responseType, '');
	});
}
﻿
/*
 * historical.html
 *

<!doctype html>
<meta charset="utf-8">
<title>Historical features</title>
<script src="/resources/testharness.js"></script>
<script src="/resources/testharnessreport.js"></script>
<div id="log"></div>
<script>
["moz-blob", "moz-chunked-text", "moz-chunked-arraybuffer"].forEach(function(rt) {
  test(function() {
    var xhr = new XMLHttpRequest();
    xhr.responseType = rt;
    assert_equals(xhr.responseType, "");
  }, "Support for responseType = " + rt);
});
</script>

 *
 * historical.html
 */
