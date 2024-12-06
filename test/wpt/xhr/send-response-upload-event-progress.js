import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';
import { ProgressEvent } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	xhr.upload.onprogress = (e) => {

		assert(e instanceof ProgressEvent);
		assert(e.type === 'progress');
		assert(e.target === xhr.upload);
	};

	xhr.open('POST', `${activeURL}/content.py`);
	xhr.send('Test Message');
}
﻿
/*
 * send-response-upload-event-progress.mjs
 *

<!DOCTYPE html>
<html>
<head>
    <link rel="help" href="https://xhr.spec.whatwg.org/#handler-xhr-onprogress" data-tested-assertations="../.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#event-xhr-progress" data-tested-assertations="../.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-send()-method" data-tested-assertations="following::a[contains(@href,'#make-upload-progress-notifications')]/.. following::ol[1]/li[8]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#make-upload-progress-notifications" data-tested-assertations="following::ul[1]/li[2]/ol[1]/li[2]" />
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <title>XMLHttpRequest: The send() method: Fire a progress event named progress on the XMLHttpRequestUpload (synchronous flag is unset)</title>
</head>

<body>
    <div id="log"></div>

    <script type="text/javascript">
        var test = async_test();

        test.step(function()
        {
            var xhr = new XMLHttpRequest();

            xhr.upload.onprogress = function(e)
            {
                test.step(function()
                {
                    assert_true(e instanceof ProgressEvent);
                    assert_equals(e.type, "progress");
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
 * send-response-upload-event-progress.mjs
 */
