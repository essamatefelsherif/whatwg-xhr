import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	let progressHappened = false;

	xhr.onprogress = (pe) => {

		assert.strictEqual(pe.type, 'progress');
		assert(pe.loaded >= 0, 'loaded');
		assert(!pe.lengthComputable, 'lengthComputable');
		assert.strictEqual(pe.total, 0, 'total');

		progressHappened = true;
	};

	xhr.onloadend = () => {
		assert(progressHappened);
	};

	xhr.open('GET', `${activeURL}/trickle.py?ms=0&count=100`);
	xhr.send();
}
﻿
/*
 * firing-events-http-no-content-length.html
 *

<!doctype html>
<html>
  <head>
    <title>ProgressEvent: firing events for HTTP with no Content-Length</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
  </head>
  <body>
    <div id="log"></div>
    <script>
      async_test(t => {
        const xhr = new XMLHttpRequest();
        let progressHappened = false;

        xhr.onprogress = t.step_func(pe => {
          assert_equals(pe.type, "progress");
          assert_greater_than_equal(pe.loaded, 0, "loaded");
          assert_false(pe.lengthComputable, "lengthComputable");
          assert_equals(pe.total, 0, "total");
          progressHappened = true;
        });

        // "loadstart", "error", "abort", "load" tests are out of scope.
        // They SHOULD be tested in each spec that implement ProgressEvent.

        xhr.onloadend = t.step_func_done(() => {
          assert_true(progressHappened);
        });

        xhr.open("GET", "resources/trickle.py?ms=0&count=100", true);
        xhr.send(null);
      });
    </script>
  </body>
</html>

 *
 * firing-events-http-no-content-length.html
 */
