import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	const xhr = new XMLHttpRequest();

	const content = 'Hello';
	let blob;

	xhr.onreadystatechange = () => {

		if(xhr.readyState === 4){

			blob = xhr.response;

			assert.strictEqual(xhr.response, xhr.response, 'Response should be cached');
			assert(blob instanceof Blob, 'blob is a Blob');

			blob.text()
				.then(text => {
					assert.strictEqual(text, content);
				});

			xhr.onreadystatechange = null;
		}
	};

	xhr.open('GET', `${activeURL}/content.py?content=${content}`);
	xhr.responseType = 'blob';
	xhr.send();
}
﻿
/*
 * response-data-blob.htm
 *

<!DOCTYPE html>
<html>
<head>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-send()-method" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-responsetype-attribute"  data-tested-assertations="following::ol[1]/li[4]"/>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-response-attribute"  data-tested-assertations="following::a[contains(@href,'#blob-response-entity-body')]/.." />
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <title>XMLHttpRequest: The response attribute: Blob data</title>
</head>

<body>
    <div id="log"></div>

    <script type="text/javascript">
        var test = async_test();

        test.step(function()
        {
            var xhr = new XMLHttpRequest();
            var content = "Hello";
            var blob;

            xhr.onreadystatechange = function()
            {
                if (xhr.readyState == 4)
                {
                    test.step(function()
                    {
                        blob = xhr.response;
                        assert_equals(xhr.response, xhr.response,
                                      "Response should be cached");
                        assert_true(blob instanceof Blob, 'blob is a Blob');

                        var reader = new FileReader();
                        reader.onload = function()
                        {
                            test.step(function()
                            {
                                assert_equals(reader.result, content);
                                test.done();
                            });
                        };
                        reader.readAsText(blob);
                    });
                }
            }

            xhr.open("GET", "./resources/content.py?content=" + content, true);
            xhr.responseType = "blob";
            xhr.send();
        });
    </script>
</body>
</html>

 *
 * response-data-blob.htm
 */
