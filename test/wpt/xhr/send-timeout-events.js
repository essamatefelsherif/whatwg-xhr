import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	let expect = [4, '', 'upload.timeout', 'upload.loadend', 'timeout', 'loadend'];
	let actual = [];

	xhr.onreadystatechange = () => {
		if(xhr.readyState === 4) {
			actual.push(xhr.readyState, xhr.response);
		}
	};

	xhr.onloadend = (e) => {
		assert.strictEqual(e.loaded, 0);
		assert.strictEqual(e.total, 0);

		actual.push(e.type);

		assert.deepStrictEqual(actual, expect);
	};

	xhr.ontimeout = (e) => {
		assert.strictEqual(e.loaded, 0);
		assert.strictEqual(e.total, 0);

		actual.push(e.type);
	};

	xhr.upload.onloadend = (e) => {
		assert.strictEqual(e.loaded, 0);
		assert.strictEqual(e.total, 0);

		actual.push('upload.' + e.type);
	};

	xhr.upload.ontimeout = (e) => {
		assert.strictEqual(e.loaded, 0);
		assert.strictEqual(e.total, 0);

		actual.push('upload.' + e.type);
	};

	let content = '';
	for (let i = 0; i < 121026; i++) {
		content += '[' + i + ']';
	}

	xhr.open('POST', `${activeURL}/trickle.py`);

	xhr.timeout = 1;
	xhr.send(content);
}
﻿
/*
 * send-timeout-events.htm
 *

<!DOCTYPE html>
<html>
<head>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <title>XMLHttpRequest: The send() method: timeout is not 0 </title>
</head>

<body>
    <div id="log"></div>

    <script type="text/javascript">
        async_test(t => {
            const xhr = new XMLHttpRequest(),
                  expect = [4, "", "upload.timeout", "upload.loadend", "timeout", "loadend"];
            let actual = [];

            xhr.onreadystatechange = t.step_func(() => {
                if (xhr.readyState == 4) {
                    actual.push(xhr.readyState, xhr.response);
                }
            });

            xhr.onloadend = t.step_func_done(e => {
                assert_equals(e.loaded, 0);
                assert_equals(e.total, 0);
                actual.push(e.type);
                assert_array_equals(actual, expect);
            });

            xhr.ontimeout = t.step_func(e => {
                assert_equals(e.loaded, 0);
                assert_equals(e.total, 0);
                actual.push(e.type);
            });

            xhr.upload.onloadend = t.step_func(e => {
                assert_equals(e.loaded, 0);
                assert_equals(e.total, 0);
                actual.push("upload." + e.type);
            });

            xhr.upload.ontimeout = t.step_func(e => {
                assert_equals(e.loaded, 0);
                assert_equals(e.total, 0);
                actual.push("upload." + e.type);
            });

            let content = "";
            for (var i = 0; i < 121026; i++) {
                content += "[" + i + "]";
            }

            xhr.open("POST", "./resources/trickle.py", true);
            xhr.timeout = 1;
            xhr.send(content);
        });
    </script>
</body>
</html>

 *
 * send-timeout-events.htm
 */
