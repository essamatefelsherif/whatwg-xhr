import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

import { prepare_xhr_for_event_order_test } from './xmlhttprequest-event-order.js?q8';
import { assert_xhr_event_order_matches } from './xmlhttprequest-event-order.js?q8';

export default (activeURL) => {

	let xhr  = new XMLHttpRequest();
	let timeout;

	prepare_xhr_for_event_order_test(xhr);

	xhr.onloadend = () => {
		assert_xhr_event_order_matches([
			1,
			"loadstart(0,0,false)",
			"upload.loadstart(0,12,true)",
			4,
			"upload.timeout(0,0,false)",
			"upload.loadend(0,0,false)",
			"timeout(0,0,false)",
			"loadend(0,0,false)"
		]);

		xhr.upload.onloadend = null;
		xhr.onloadend = null;
		clearTimeout(timeout);
	};

	xhr.timeout = 5;
	xhr.open('POST', `${activeURL}/delay.py?ms=20000`);
	xhr.send('Test Message');

	timeout = setTimeout(() => {
		assert(false, 'ontimeout not called.');
	}, 2000);
}

/*
 * event-timeout-order.any.js
 *

// META: title=XMLHttpRequest: event - timeout (order of events)
// META: script=resources/xmlhttprequest-event-order.js

var test = async_test();
test.step(function () {
    var xhr = new XMLHttpRequest();
    prepare_xhr_for_event_order_test(xhr);
    xhr.addEventListener("loadend", function () {
        test.step(function () {
            assert_xhr_event_order_matches([1, "loadstart(0,0,false)", "upload.loadstart(0,12,true)", 4, "upload.timeout(0,0,false)", "upload.loadend(0,0,false)", "timeout(0,0,false)", "loadend(0,0,false)"]);
            test.done();
        });
    });

    xhr.timeout = 5;
    xhr.open("POST", "resources/delay.py?ms=20000");
    xhr.send("Test Message");
    test.step_timeout(() => {
        assert_unreached("ontimeout not called.");
    }, 2000);
});

 *
 * event-timeout-order.any.js
 */
