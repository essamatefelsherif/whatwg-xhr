import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	let progressHappened = false;

	xhr.onprogress = (pe) => {

		assert.strictEqual(pe.type, 'progress');
		assert(pe.loaded >= 0, 'loaded');
		assert(pe.lengthComputable, 'lengthComputable');
		assert.strictEqual(pe.total, 1300, 'total');

		progressHappened = true;
	};

	xhr.onloadend = () => {
		assert(progressHappened);
	};

	xhr.open('GET', `${activeURL}/trickle.py?ms=0&count=100&specifylength=1`);
	xhr.send();
}
﻿
/*
 * firing-events-http-content-length.html
 *

<!doctype html>
<html>
  <head>
    <title>ProgressEvent: firing events for HTTP with Content-Length</title>
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
          assert_true(pe.lengthComputable, "lengthComputable");
          assert_equals(pe.total, 1300, "total");
          progressHappened = true;
        });

        xhr.onloadend = t.step_func_done(() => {
          assert_true(progressHappened);
        });

        xhr.open("GET", "resources/trickle.py?ms=0&count=100&specifylength=1", true);
        xhr.send(null);
      });
    </script>
  </body>
</html>

 *
 * firing-events-http-content-length.html
 */
