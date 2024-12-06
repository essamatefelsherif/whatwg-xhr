import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let blobTests = [
		['no mime type',      new Blob(['data'])],
		['invalid mime type', new Blob(['data'], {type: 'Invalid \r\n mime \r\n type'})]
	];

	blobTests.forEach((item) => {
		doSyncTest(item, 'POST');
		doAsyncTest(item, 'POST');

		doSyncTest(item, 'PUT');
		doAsyncTest(item, 'PUT');
	});

	function doSyncTest(testItem, method){

		let xhr = new XMLHttpRequest();

		xhr.open(method, `${activeURL}/content.py`, false);
		xhr.send(testItem[1]);

		assert.strictEqual(xhr.getResponseHeader('X-Request-Content-Length'), '4');
		assert.strictEqual(xhr.getResponseHeader('X-Request-Content-Type'), 'NO');
	}

	function doAsyncTest(testItem, method) {

		let xhr = new XMLHttpRequest();

		xhr.onreadystatechange = () => {
			if(xhr.readyState == 4){

				assert.strictEqual(xhr.getResponseHeader('X-Request-Content-Length'), '4');
				assert.strictEqual(xhr.getResponseHeader('X-Request-Content-Type'), 'NO');

				xhr.onreadystatechange = null;
			}
		};

		xhr.open(method, `${activeURL}/content.py`, true);
		xhr.send(testItem[1]);
 	}
}
﻿
/*
 * send-blob-with-no-mime-type.html
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
    <title>XMLHttpRequest: The send() method: Blob data with no mime type</title>
</head>

<body>
    <div id="log"></div>

    <script type="text/javascript">
        var blobTests = [
            ["no mime type", new Blob(["data"])],
            ["invalid mime type", new Blob(["data"], {type: "Invalid \r\n mime \r\n type"})]
        ];

        function doSyncTest(testItem, method) {
            test(function() {
                var xhr = new XMLHttpRequest();
                xhr.open(method, "./resources/content.py", false);
                xhr.send(testItem[1]);

                assert_equals(xhr.getResponseHeader("X-Request-Content-Length"), "4");
                assert_equals(xhr.getResponseHeader("X-Request-Content-Type"), "NO");
            }, "Synchronous blob loading with " + testItem[0] + " [" + method + "]");
        }

        function doAsyncTest(testItem, method) {
            var atest = async_test("Asynchronous blob loading with " + testItem[0] + " [" + method + "]");
            atest.step(function() {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        atest.step(function() {
                            assert_equals(xhr.getResponseHeader("X-Request-Content-Length"), "4");
                            assert_equals(xhr.getResponseHeader("X-Request-Content-Type"), "NO");
                        });
                        atest.done();
                    }
                }
                xhr.open(method, "./resources/content.py", true);
                xhr.send(testItem[1]);
            });
        }

        blobTests.forEach(function(item){
            doSyncTest(item, "POST");
            doAsyncTest(item, "POST");

            doSyncTest(item, "PUT");
            doAsyncTest(item, "PUT");
        });
    </script>
</body>
</html>

 *
 * send-blob-with-no-mime-type.html
 */
