import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

import { prepare_xhr_for_event_order_test } from './xmlhttprequest-event-order.js?q1';
import { assert_xhr_event_order_matches } from './xmlhttprequest-event-order.js?q1';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	prepare_xhr_for_event_order_test(xhr);

	xhr.addEventListener('loadstart', () => {
		let readyState = xhr.readyState;
		if(readyState === 1){
			xhr.abort();
			assert_xhr_event_order_matches([
				1,
				'loadstart(0,0,false)',
				4,
				'upload.abort(0,0,false)',
				'upload.loadend(0,0,false)',
				'abort(0,0,false)',
				'loadend(0,0,false)'
			]);
			assert(xhr.readyState === 0, 'state should be UNSENT');
		}
		else{
			assert(false, `'loadstart' event should not fire in readyState ${readyState}`);
		}
	});

    xhr.upload.onloadend = () => {};

	xhr.open('POST', `${activeURL}/content.py`);
	xhr.send('Test Message');
}
﻿
/*
 * abort-event-order.htm
 *

<!DOCTYPE html>
<html>
<head>
    <link rel='help' href='https://xhr.spec.whatwg.org/#the-abort()-method' data-tested-assertations='following-sibling::ol/li[4]/ol/li[3] following-sibling::ol/li[4]/ol/li[5] following-sibling::ol/li[4]/ol/li[6] following-sibling::ol/li[4]/ol/li[7]/ol/li[3] following-sibling::ol/li[4]/ol/li[7]/ol/li[4] following-sibling::ol/li[5]' />
    <script src='/resources/testharness.js'></script>
    <script src='/resources/testharnessreport.js'></script>
    <script src='resources/xmlhttprequest-event-order.js'></script>
    <title>XMLHttpRequest: The abort() method: abort and loadend events</title>
</head>

<body>
    <div id='log'></div>

    <script type='text/javascript'>
        var test = async_test();

        test.step(function()
        {
            var xhr = new XMLHttpRequest();
            prepare_xhr_for_event_order_test(xhr);

            xhr.addEventListener('loadstart', function() {
                test.step(function()
                {
                    var readyState = xhr.readyState;
                    if (readyState == 1)
                    {
                        xhr.abort();
                        VerifyResult();
                    } else {
                        assert_unreached('Loadstart event should not fire in readyState '+readyState);
                    }
                });
            });

            function VerifyResult()
            {
                test.step(function()
                {
                    assert_xhr_event_order_matches([1, 'loadstart(0,0,false)', 4, 'upload.abort(0,0,false)', 'upload.loadend(0,0,false)', 'abort(0,0,false)', 'loadend(0,0,false)']);

                    assert_equals(xhr.readyState, 0, 'state should be UNSENT');
                    test.done();
                });
            };

            xhr.open('POST', './resources/content.py', true);
            xhr.send('Test Message');
        });
    </script>
</body>
</html>

 *
 * abort-event-order.htm
 */
