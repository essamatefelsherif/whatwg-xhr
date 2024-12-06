import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';
import { ProgressEvent } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = () => {

		if(xhr.readyState === 4){
			assert.strictEqual(xhr.response, '');
		}
	};

	xhr.onloadend = (e) => {

		assert(e instanceof ProgressEvent);
		assert.strictEqual(e.type, 'loadend');

		xhr.onloadend = null;
		xhr.onreadystatechange = null;
	};

	xhr.open('POST', `${activeURL}/content.py`, true);
	xhr.send();
}
﻿
/*
 * send-no-response-event-loadend.htm
 *

<!DOCTYPE html>
<html>
<head>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <title>XMLHttpRequest: The send() method: Fire a progress event named loadend (no response entity body)</title>
    <link rel="help" href="https://xhr.spec.whatwg.org/#handler-xhr-onloadend" data-tested-assertations="/../.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#event-xhr-loadend" data-tested-assertations="/../.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#infrastructure-for-the-send()-method" data-tested-assertations="following::dt[10] /following-sibling::ol/li[10]" />
</head>

<body>
    <div id="log"></div>

    <script type="text/javascript">
        var test = async_test();

        test.step(function ()
        {
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function()
            {
                test.step(function()
                {
                    if (xhr.readyState == 4)
                    {
                        assert_equals(xhr.response, "");
                    }
                });
            };

            xhr.onloadend = function(e)
            {
                test.step(function()
                {
                    assert_true(e instanceof ProgressEvent);
                    assert_equals(e.type, "loadend");
                    test.step(function() { test.done(); });
                });
            };

            xhr.open("POST", "./resources/content.py", true);
            xhr.send();
        });
    </script>
</body>
</html>

 *
 * send-no-response-event-loadend.htm
 */
