import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = () => {

		if(xhr.readyState === 3){
			assert.strictEqual(xhr.response, '');
		}
		else
		if(xhr.readyState === 4){
			assert(false, 'loadstart event did not fire in LOADING state!');
		}

	};

	xhr.onloadstart = () => {
		xhr.onreadystatechange = null;
	};

	xhr.open('POST', `${activeURL}/content.py`, true);
	xhr.send();
}
﻿
/*
 * send-no-response-event-loadstart.htm
 *

<!DOCTYPE html>
<html>
<head>
    <link rel="help" href="https://xhr.spec.whatwg.org/#handler-xhr-onloadstart" data-tested-assertations="/../.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#event-xhr-loadstart" data-tested-assertations="/../.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-send()-method" data-tested-assertations="/following-sibling::ol/li[9]/ol/li[2]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-response-attribute" data-tested-assertations="/following-sibling::ol/li[1]" />
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <title>XMLHttpRequest: The send() method: Fire a progress event named loadstart (no response entity body and the state is LOADING)</title>
</head>

<body>
    <div id="log"></div>

    <script type="text/javascript">
        var test = async_test();

        test.step(function()
        {
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function()
            {
                test.step(function()
                {
                    if (xhr.readyState == 3)
                    {
                        assert_equals(xhr.response, "");
                    }
                    else if (xhr.readyState == 4)
                    {
                        assert_unreached("loadstart event did not fire in LOADING state!");
                    }
                });
            };

            xhr.onloadstart = function()
            {
                test.step(function() { test.done("Test done!"); });
            };

            xhr.open("POST", "./resources/content.py", true);
            xhr.send();
        });
    </script>
</body>
</html>

 *
 * send-no-response-event-loadstart.htm
 */
