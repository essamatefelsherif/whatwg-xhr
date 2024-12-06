import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

import { prepare_xhr_for_event_order_test } from './xmlhttprequest-event-order.js?q7';
import { assert_xhr_event_order_matches } from './xmlhttprequest-event-order.js?q7';

export default (activeURL) => {

	let hasrun = false;
	let xhr = new XMLHttpRequest();

	xhr.open('GET', `${activeURL.replace('/resources', '') + '/folder.txt'}`, false);

	setTimeout(() => { hasrun = true }, 0);

	xhr.onreadystatechange = () => {
		assert.strictEqual(xhr.readyState, 4);
		assert(!hasrun);
	};

	xhr.send();
	xhr.onreadystatechange = null;
}
﻿
/*
 * send-sync-timeout.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: timeout during sync send() should not run</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-send()-method"/>
  </head>
  <body>
    <div id="log"></div>
    <script>
      var test = async_test(),
          hasrun = false
      test.step(function() {
        client = new XMLHttpRequest()
        client.open("GET", "folder.txt", false)
        test.step_timeout(() => { hasrun = true }, 0)
        client.onreadystatechange = function() {
          test.step(function() {
            assert_equals(client.readyState, 4)
            assert_false(hasrun)
          })
        }
        client.send(null)
        test.done()
      })
    </script>
  </body>
</html>

 *
 * send-sync-timeout.htm
 */
