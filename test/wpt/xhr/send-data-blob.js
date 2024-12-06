import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr  = new XMLHttpRequest();
	let xhr2 = new XMLHttpRequest();

	let content = 'Hello';
	let blob;

	xhr.onreadystatechange = () => {
		if(xhr.readyState === 4){

			blob = xhr.response;

			assert(blob instanceof Blob, 'Blob from XHR Response');

			xhr2.open('POST', `${activeURL}/content.py`, true);
			xhr2.send(blob);
		}
	};

	xhr2.onreadystatechange = () => {
		if(xhr2.readyState === 4){

			assert.strictEqual(xhr2.status, 200);
			assert.strictEqual(xhr2.response, content);

			xhr.onreadystatechange = null;
			xhr2.onreadystatechange = null;
		}
	};

	xhr.open('GET', `${activeURL}/content.py?content=${content}`, true);
	xhr.responseType = 'blob';
	xhr.send();
}
﻿
/*
 * send-data-blob.htm
 *

<!DOCTYPE html>
<html>
<head>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-send()-method" data-tested-assertations="following::ol[1]/li[4] following::ol[1]/li[4]/dl[1]/dd[2]/p[3]"/>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-status-attribute"  data-tested-assertations="following::ol[1]/li[3]"/>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-responsetype-attribute"  data-tested-assertations="following::ol[1]/li[4]"/>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-response-attribute"  data-tested-assertations="following::a[contains(@href,'#blob-response-entity-body')]/.."/>

    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <title>XMLHttpRequest: The send() method: Blob data</title>
</head>

<body>
    <div id="log"></div>

    <script type="text/javascript">
        var test = async_test();

        test.step(function()
        {
            var xhr = new XMLHttpRequest();
            var xhr2 = new XMLHttpRequest();

            var content = "Hello";
            var blob;

            xhr.onreadystatechange = function()
            {
                if (xhr.readyState == 4)
                {
                    test.step(function()
                    {
                        blob = xhr.response;
                        assert_true(blob instanceof Blob, "Blob from XHR Response");

                        xhr2.open("POST", "./resources/content.py", true);
                        xhr2.send(blob);
                    });
                }
            }

            xhr2.onreadystatechange = function()
            {
                if (xhr2.readyState == 4)
                {
                    test.step(function()
                    {
                        assert_equals(xhr2.status, 200);
                        assert_equals(xhr2.response, content);
                        test.done();
                    });
                }
            };

            xhr.open("GET", "./resources/content.py?content=" + content, true);
            xhr.responseType = "blob";
            xhr.send();
        });
    </script>
</body>
</html>

 *
 * send-data-blob.htm
 */
