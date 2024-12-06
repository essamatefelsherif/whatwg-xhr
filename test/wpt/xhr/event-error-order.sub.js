import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

import { prepare_xhr_for_event_order_test } from './xmlhttprequest-event-order.js?q3';
import { assert_xhr_event_order_matches } from './xmlhttprequest-event-order.js?q3';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	prepare_xhr_for_event_order_test(xhr);

	xhr.addEventListener('loadend', () => {
		assert_xhr_event_order_matches([
			1,
			'loadstart(0,0,false)',
			'upload.loadstart(0,12,true)',
			4,
			'upload.error(0,0,false)',
			'upload.loadend(0,0,false)',
			'error(0,0,false)',
			'loadend(0,0,false)'
		]);

		xhr.onloadend = null;
	});

	xhr.open('POST', `http://nonexistent`);
	xhr.send('Test Message');
}
﻿
/*
 * event-error-order.sub.htm
 *

<!DOCTYPE html>
<html>
<head>
    <meta name="assert" content="Check the order of events fired when the request has failed.">
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <script src="resources/xmlhttprequest-event-order.js"></script>
    <title>XMLHttpRequest: event - error (order of events)</title>
</head>

<body>
    <div id="log"></div>

    <script type="text/javascript">
        var test = async_test();

        test.step(function()
        {
            var xhr = new XMLHttpRequest();
            prepare_xhr_for_event_order_test(xhr);

            xhr.addEventListener("loadend", function() {
                test.step(function() {
                    // no progress events due to CORS failure
                    assert_xhr_event_order_matches([1, "loadstart(0,0,false)", "upload.loadstart(0,12,true)", 4, "upload.error(0,0,false)", "upload.loadend(0,0,false)", "error(0,0,false)", "loadend(0,0,false)"]);
                    test.done();
                });
            });

            xhr.open("POST", "http://nonexistent.{{host}}:{{ports[http][0]}}", true);
            xhr.send("Test Message");
        });
    </script>
</body>
</html>

 *
 * event-error-order.sub.htm
 */
