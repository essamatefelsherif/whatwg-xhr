import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';
import { ProgressEvent } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	xhr.upload.onloadstart = (e) => {

		assert(e instanceof ProgressEvent);
		assert(e.type === 'loadstart');
		assert(e.target === xhr.upload);
	};

	xhr.open('POST', `${activeURL}/content.py`);
	xhr.send('Test Message');
}
﻿
/*
 * send-response-upload-event-loadstart.mjs
 *

<!DOCTYPE html>
<html>
<head>
    <link rel="help" href="https://xhr.spec.whatwg.org/#handler-xhr-onloadstart" data-tested-assertations="../.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#event-xhr-loadstart" data-tested-assertations="../.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-send()-method" data-tested-assertations="following::ol[1]/li[8] following-sibling::ol/li[9]/ol/li[3]" />

    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <title>XMLHttpRequest: The send() method: Fire a progress event named loadstart on the XMLHttpRequestUpload (synchronous flag is unset)</title>
</head>

<body>
    <div id="log"></div>

    <script type="text/javascript">
        var test = async_test();

        test.step(function()
        {
            var xhr = new XMLHttpRequest();

            xhr.upload.onloadstart = function(e)
            {
                test.step(function()
                {
                    assert_true(e instanceof ProgressEvent);
                    assert_equals(e.type, "loadstart");
                    assert_equals(e.target, xhr.upload);
                    test.done();
                });
            };

            xhr.open("POST", "./resources/content.py", true);
            xhr.send("Test Message");
        });
    </script>
</body>
</html>

 *
 * send-response-upload-event-loadstart.mjs
 */
