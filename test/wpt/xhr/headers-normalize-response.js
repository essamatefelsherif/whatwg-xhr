import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	error('hello world\0');
	error('\0hello world');
	error('hello\0world');

	matchHeaderValue('  hello world');
	matchHeaderValue('hello world  ');
	matchHeaderValue('  hello world  ');
	matchHeaderValue('\thello world');
	matchHeaderValue('hello world\t');
	matchHeaderValue('\thello world\t');
	matchHeaderValue('hello      world');
	matchHeaderValue('hello\tworld');

	error('\0');

	matchHeaderValue('   ');
	matchHeaderValue('\t');
	matchHeaderValue('');

	function error(val){
		const xhr = new XMLHttpRequest();

		xhr.open('GET', `${activeURL}/parse-headers.py?my-custom-header=${encodeURIComponent(val)}`, false);

		assert.throws(
			() => {
				xhr.send();
			},
			(err) => {
				assert(err instanceof DOMException, 'DOMException expected');
				assert(err.name === 'NetworkError', 'NetworkError expected');

				return true;
			}
		);
	}

	function matchHeaderValue(val){
		const xhr = new XMLHttpRequest();
		let trimmed = val.trim();

		xhr.open('GET', `${activeURL}/parse-headers.py?my-custom-header=${encodeURIComponent(val)}`, false);
		xhr.send();

		assert.strictEqual(xhr.getResponseHeader('My-Custom-Header'), trimmed);
	}
}
﻿
/*
 * headers-normalize-response.htm
 *

<!DOCTYPE html>
<meta charset=utf-8>
<title>Whitespace and null in header values</title>
<script src=/resources/testharness.js></script>
<script src=/resources/testharnessreport.js></script>
<div id=log></div>
<script>
function error(val) {
  test(() => {
    const client = new XMLHttpRequest();
    client.open("GET", "resources/parse-headers.py?my-custom-header="+encodeURIComponent(val), false);
    assert_throws_dom("NetworkError", () => client.send());
  }, "Header value: " + val.replace("\0", "\\0"));
}

function matchHeaderValue(val) {
    test(function () {
        var client = new XMLHttpRequest();
        var trimmed = val.trim();
        client.open("GET", "resources/parse-headers.py?my-custom-header="+encodeURIComponent(val), false);
        client.send();
        var r = client.getResponseHeader("My-Custom-Header");

        assert_equals(r, trimmed);
    }, "Header value: " + val.replace(/\t/g, "[tab]").replace(/ /g, "_"));
}

error("hello world\0");
error("\0hello world");
error("hello\0world");
matchHeaderValue("  hello world");
matchHeaderValue("hello world  ");
matchHeaderValue("  hello world  ");
matchHeaderValue("\thello world");
matchHeaderValue("hello world\t");
matchHeaderValue("\thello world\t");
matchHeaderValue("hello      world");
matchHeaderValue("hello\tworld");
error("\0");
matchHeaderValue("   ");
matchHeaderValue("\t");
matchHeaderValue("");
</script>

 *
 * headers-normalize-response.htm
 */
