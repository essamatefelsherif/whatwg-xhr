import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

import { prepare_xhr_for_event_order_test } from './xmlhttprequest-event-order.js?q2';
import { assert_xhr_event_order_matches } from './xmlhttprequest-event-order.js?q2';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	prepare_xhr_for_event_order_test(xhr);

	xhr.addEventListener('loadend', () => {
			assert_xhr_event_order_matches([
				1,
				`loadstart(0,0,false)`,
				`upload.loadstart(0,12,true)`,
				`upload.progress(12,12,true)`,
				`upload.load(12,12,true)`,
				`upload.loadend(12,12,true)`,
				2,
				3,
				`progress(12,12,true)`,
				4,
				`load(12,12,true)`,
				`loadend(12,12,true)`
			]);
	});

	xhr.upload.onloadend = () => {};

	xhr.open('POST', `${activeURL}/content.py`);
	xhr.send('Test Message');
}
﻿
/*
 * send-response-event-order.htm
 *

<!DOCTYPE html>
<html>
<head>
    <link rel='help' href='https://xhr.spec.whatwg.org/#handler-xhr-onloadstart' data-tested-assertations='../..' />
    <link rel='help' href='https://xhr.spec.whatwg.org/#handler-xhr-onloadend' data-tested-assertations='../..' />
    <link rel='help' href='https://xhr.spec.whatwg.org/#event-xhr-loadstart' data-tested-assertations='../..' />
    <link rel='help' href='https://xhr.spec.whatwg.org/#event-xhr-loadend' data-tested-assertations='../..' />
    <link rel='help' href='https://xhr.spec.whatwg.org/#the-send()-method' data-tested-assertations='following-sibling::ol/li[9]/ol/li[2] following-sibling::ol/li[9]/ol/li[3] following::a[contains(@href,'#make-upload-progress-notifications')]/.. following::a[contains(@href,'#make-progress-notifications')]/..' />
    <link rel='help' href='https://xhr.spec.whatwg.org/#make-upload-progress-notifications' data-tested-assertations='following::ul[1]/li[1] following::ul[1]/li[2]/ol[1]/li[2] following::ul[1]/li[2]/ol[1]/li[3] following::ul[1]/li[2]/ol[1]/li[4]' />
    <link rel='help' href='https://xhr.spec.whatwg.org/#make-progress-notifications' data-tested-assertations='..' />
    <link rel='help' href='https://xhr.spec.whatwg.org/#infrastructure-for-the-send()-method' data-tested-assertations='following::a[contains(@href,'#switch-done')]/..' />
    <link rel='help' href='https://xhr.spec.whatwg.org/#switch-done' data-tested-assertations='following::ol[1]/li[3] following::ol[1]/li[4] following::ol[1]/li[5] following::ol[1]/li[6] following::ol[1]/li[7]' />
    <script src='/resources/testharness.js'></script>
    <script src='/resources/testharnessreport.js'></script>
    <script src='resources/xmlhttprequest-event-order.js'></script>
    <title>XMLHttpRequest: The send() method: event order when synchronous flag is unset</title>
</head>

<body>
    <div id='log'></div>

    <script type='text/javascript'>
        var test = async_test();

        test.step(function()
        {
            var xhr = new XMLHttpRequest();
            prepare_xhr_for_event_order_test(xhr);

            xhr.addEventListener('loadend', test.step_func(function() {
                assert_xhr_event_order_matches([1, 'loadstart(0,0,false)', 'upload.loadstart(0,12,true)', 'upload.progress(12,12,true)', 'upload.load(12,12,true)', 'upload.loadend(12,12,true)', 2, 3, 'progress(12,12,true)', 4, 'load(12,12,true)', 'loadend(12,12,true)']);
                test.done();
            }));

            xhr.open('POST', './resources/content.py', true);
            xhr.send('Test Message');
        });
    </script>
</body>
</html>

 *
 * send-response-event-order.htm
 */
