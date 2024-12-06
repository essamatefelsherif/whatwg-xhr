import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	const xhr = new XMLHttpRequest();

	xhr.onreadystatechange = () => {

		if(xhr.readyState === 4){

			assert.strictEqual(xhr.status, 200);

			let buf = xhr.response;
			assert(buf instanceof ArrayBuffer);

			let arr = new Uint8Array(buf);

			assert.strictEqual(arr.length, 5);
			assert.strictEqual(arr[0], 0x48, 'Expect "H"');
			assert.strictEqual(arr[1], 0x65, 'Expect "e"');
			assert.strictEqual(arr[2], 0x6c, 'Expect "l"');
			assert.strictEqual(arr[3], 0x6c, 'Expect "l"');
			assert.strictEqual(arr[4], 0x6f, 'Expect "o"');
			assert.strictEqual(xhr.response, xhr.response, 'Response should be cached');

			xhr.onreadystatechange = null;
		}
	};

	xhr.open('GET', `${activeURL}/content.py?content=Hello`);
	xhr.responseType = 'arraybuffer';
	xhr.send();
}
﻿
/*
 * response-data-arraybuffer.htm
 *

<!DOCTYPE html>
<html>
<head>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-responsetype-attribute" data-tested-assertations="following::ol[1]/li[4]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-response-attribute" data-tested-assertations="following::a[contains(@href,'#arraybuffer-response-entity-body')]/.." />
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <title>XMLHttpRequest: The response attribute: ArrayBuffer data</title>
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
                if (xhr.readyState == 4)
                {
                    test.step(function()
                    {
                        assert_equals(xhr.status, 200);

                        var buf = xhr.response;
                        assert_true(buf instanceof ArrayBuffer);

                        var arr = new Uint8Array(buf);
                        assert_equals(arr.length, 5);
                        assert_equals(arr[0], 0x48, "Expect 'H'");
                        assert_equals(arr[1], 0x65, "Expect 'e'");
                        assert_equals(arr[2], 0x6c, "Expect 'l'");
                        assert_equals(arr[3], 0x6c, "Expect 'l'");
                        assert_equals(arr[4], 0x6f, "Expect 'o'");

                        assert_equals(xhr.response, xhr.response,
                                      "Response should be cached");

                        test.done();
                    });
                }
            };

            xhr.open("GET", "./resources/content.py?content=Hello", true);
            xhr.responseType = "arraybuffer";
            xhr.send();
        });
    </script>
</body>
</html>

 *
 * response-data-arraybuffer.htm
 */
