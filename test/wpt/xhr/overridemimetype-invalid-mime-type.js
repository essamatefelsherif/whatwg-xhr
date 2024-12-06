import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	// Bogus MIME type does not override encoding
	(() => {
		const xhr = new XMLHttpRequest();

		xhr.onload = () => {
			assert.strictEqual(xhr.responseText, 'ÿ');
			assert.strictEqual(xhr.getResponseHeader('Content-Type'), 'text/html;charset=windows-1252');
		};

		xhr.open('GET', `${activeURL}/status.py?type=${encodeURIComponent('text/html;charset=windows-1252')}&content=%FF`);
		xhr.overrideMimeType('bogus');
		xhr.send();
	})();

	// Bogus MIME type does not override encoding
	(() => {
		const xhr = new XMLHttpRequest();

		xhr.onload = () => {
			assert.strictEqual(xhr.responseText, 'ÿ');
			assert.strictEqual(xhr.getResponseHeader('Content-Type'), 'text/html;charset=windows-1252');
		};

		xhr.open('GET', `${activeURL}/status.py?type=${encodeURIComponent('text/html;charset=windows-1252')}&content=%FF`);
		xhr.overrideMimeType('bogus;charset=Shift_JIS');
		xhr.send();
	})();

	// Bogus MIME type does override MIME type
	(() => {
		const xhr = new XMLHttpRequest();

		xhr.onload = () => {
			assert.strictEqual(xhr.responseXML, null);
			assert.strictEqual(xhr.getResponseHeader('Content-Type'), 'text/xml');
		};

		xhr.open('GET', `${activeURL}/status.py?type=${encodeURIComponent('text/xml')}&content=${encodeURIComponent('<x/>')}`);
		xhr.overrideMimeType('bogus');
		xhr.send();
	})();
}
﻿
/*
 * overridemimetype-invalid-mime-type.htm
 *

<!doctype html>
<title>XMLHttpRequest: overrideMimeType() and invalid MIME types</title>
<meta charset="utf-8">
<script src="/resources/testharness.js"></script>
<script src="/resources/testharnessreport.js"></script>
<link rel="help" href="https://xhr.spec.whatwg.org/#the-overridemimetype()-method">
<div id="log"></div>
<script>
async_test(t => {
  const client = new XMLHttpRequest()
  client.onload = t.step_func_done(() => {
    assert_equals(client.responseText, "ÿ")
    assert_equals(client.getResponseHeader("Content-Type"), "text/html;charset=windows-1252")
  })
  client.open("GET", "resources/status.py?type=" + encodeURIComponent("text/html;charset=windows-1252") + "&content=%FF")
  client.overrideMimeType("bogus")
  client.send()
}, "Bogus MIME type does not override encoding")

async_test(t => {
  const client = new XMLHttpRequest()
  client.onload = t.step_func_done(() => {
    assert_equals(client.responseText, "ÿ")
    assert_equals(client.getResponseHeader("Content-Type"), "text/html;charset=windows-1252")
  })
  client.open("GET", "resources/status.py?type=" + encodeURIComponent("text/html;charset=windows-1252") + "&content=%FF")
  client.overrideMimeType("bogus;charset=Shift_JIS")
  client.send()
}, "Bogus MIME type does not override encoding, 2")

async_test(t => {
  const client = new XMLHttpRequest()
  client.onload = t.step_func_done(() => {
    assert_equals(client.responseXML, null)
    assert_equals(client.getResponseHeader("Content-Type"), "text/xml")
  })
  client.open("GET", "resources/status.py?type=" + encodeURIComponent("text/xml") + "&content=" + encodeURIComponent("<x/>"))
  client.overrideMimeType("bogus")
  client.send()
}, "Bogus MIME type does override MIME type")
</script>

 *
 * overridemimetype-invalid-mime-type.htm
 */
