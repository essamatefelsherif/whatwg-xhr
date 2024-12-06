import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';
import { ProgressEvent } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	let pass = false;

	xhr.onloadend = (e) => {

		assert(e instanceof ProgressEvent);
		assert.strictEqual(e.type, 'loadend');
		pass = true;
	};

	xhr.open('POST', `${activeURL}/content.py`, false);
	xhr.send();

	assert.strictEqual(xhr.response, '');
	assert(pass);
}
﻿
/*
 * send-sync-no-response-event-loadend.htm
 *

<!DOCTYPE html>
<html>
<head>
    <link rel="help" href="https://xhr.spec.whatwg.org/#handler-xhr-onloadend" data-tested-assertations="../.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#event-xhr-loadend" data-tested-assertations="../.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#infrastructure-for-the-send()-method" data-tested-assertations="following::dt[11] following::a[contains(@href,'#switch-done')]/.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#switch-done" data-tested-assertations="following::ol/li[1] following::ol/li[7]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-response-attribute" data-tested-assertations="/following::ol/li[3]" />
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <title>XMLHttpRequest: The send() method: Fire an event named loadend (no response entity body and the synchronous flag is set)</title>
</head>

<body>
    <div id="log"></div>

    <script type="text/javascript">
        test(function()
        {
            var xhr = new XMLHttpRequest();
            var pass = false;

            xhr.onloadend = function(e)
            {
                assert_true(e instanceof ProgressEvent);
                assert_equals(e.type, "loadend");
                pass = true;
            };

            xhr.open("POST", "./resources/content.py", false);
            xhr.send();

            assert_equals(xhr.response, "");
            assert_true(pass);
        });
    </script>
</body>
</html>

 *
 * send-sync-no-response-event-loadend.htm
 */
