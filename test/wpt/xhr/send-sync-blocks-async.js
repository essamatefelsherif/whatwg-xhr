import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

import { prepare_xhr_for_event_order_test } from './xmlhttprequest-event-order.js?q5';
import { assert_xhr_event_order_matches } from './xmlhttprequest-event-order.js?q5';

export default (activeURL) => {

	let expect = ['sync 4', 'async 2', 'async 3', 'async 4'];
	let actual = [];

	let xhr_async = new XMLHttpRequest();

	// first launch an async request, completes in 1 second
	xhr_async.open('GET', `${activeURL}/delay.py?ms=1000`, true);

	xhr_async.onreadystatechange = () => {
		actual.push('async ' + xhr_async.readyState);

		if(xhr_async.readyState === 4 && actual.indexOf('sync 4') > -1){
			assert.deepStrictEqual(actual, expect);
			xhr_async.onreadystatechange = null;
		}
	};

	xhr_async.send();

	setTimeout(() => {

		let xhr_sync = new XMLHttpRequest();

		// here's a sync request that will take 2 seconds to finish
		xhr_sync.open('GET', `${activeURL}/delay.py?ms=2000`, false);

		xhr_sync.onreadystatechange = () => {
			actual.push('sync ' + xhr_sync.readyState);

			if(xhr_sync.readyState === 4 && actual.indexOf('async 4') > -1){
				assert.deepStrictEqual(actual, expect);
				xhr_sync.onreadystatechange = null;
			}
		};

        xhr_sync.send();
	}, 10);
}
﻿
/*
 * send-sync-blocks-async.htm
 *

<!DOCTYPE html>
<html>
<head>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <title>XMLHttpRequest: sync requests should block events on pending async requests</title>
</head>

<body>
    <div id="log"></div>

    <script type="text/javascript">
        var test = async_test();

        var expect = ['sync 4', 'async 2', 'async 3', 'async 4']
        var actual = []

        test.step(function()
        {
            var xhr_async = new XMLHttpRequest()
            xhr_async.open('GET', 'resources/delay.py?ms=1000', true) // first launch an async request, completes in 1 second
            xhr_async.onreadystatechange = test.step_func(() => {
                actual.push('async ' + xhr_async.readyState)
                if(xhr_async.readyState === 4 && actual.indexOf('sync 4')>-1){
                    VerifyResult()
                }
            });
            xhr_async.send()

            test.step_timeout(() => {
                var xhr_sync = new XMLHttpRequest();
                xhr_sync.open('GET', 'resources/delay.py?ms=2000', false) // here's a sync request that will take 2 seconds to finish
                xhr_sync.onreadystatechange = test.step_func(() => {
                    actual.push('sync ' + xhr_sync.readyState)
                    if(xhr_sync.readyState === 4 && actual.indexOf('async 4')>-1){
                        VerifyResult()
                    }
                });
                xhr_sync.send()
            }, 10);

            function VerifyResult()
            {
                test.step(function()
                {
                    assert_array_equals(actual, expect);
                    test.done();
                });
            };
        });
    </script>
</body>
</html>

 *
 * send-sync-blocks-async.htm
 */
