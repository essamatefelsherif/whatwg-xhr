import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	const stringBody = 'Test Message'.repeat(1000);
	const blobBody = new Blob(new Array(1000).fill('Test Message'));

	testRedirectPost( { name: '301',          code: 301, expectResendPost: false, body: stringBody} );
	testRedirectPost( { name: '302',          code: 302, expectResendPost: false, body: stringBody} );
	testRedirectPost( { name: '303',          code: 303, expectResendPost: false, body: stringBody} );
	testRedirectPost( { name: '307 (string)', code: 307, expectResendPost: true,  body: stringBody, expectedBody: stringBody } );
	testRedirectPost( { name: '307 (blob)',   code: 307, expectResendPost: true,  body: blobBody,   expectedBody: stringBody, expectedContentType: 'NO' } );

	function testRedirectPost(params){
		let actual = [];
		// We check upload.onprogress with a boolean because it *might* fire more than once
		let progressFiredReadyState1 = false;

		let expectedHeaders, expectedEvents;

		// 307 redirects should resend the POST data, and events and headers will be a little different..
		if(params.expectResendPost){
			expectedHeaders = {
				'X-Request-Content-Length': '12000',
				'X-Request-Content-Type': 'text/plain;charset=UTF-8',
				'X-Request-Method': 'POST',
				'X-Request-Query': 'NO',
				'Content-Length': '12000'
			};

			expectedEvents = [
				'xhr onreadystatechange 1',
				'xhr loadstart 1',
				'upload loadstart 1',
				'upload loadend 1',
				'xhr onreadystatechange 2',
				'xhr onreadystatechange 3',
				'xhr onreadystatechange 4',
				'xhr load 4',
				'xhr loadend 4'
			];
		}
		else {
			// setting the right expectations for POST resent as GET without request body
			expectedHeaders = {
				'X-Request-Content-Length': 'NO',
				'X-Request-Content-Type': 'NO',
				'X-Request-Method': 'GET',
				'X-Request-Query': 'NO'
			};

			expectedEvents = [
				'xhr onreadystatechange 1',
				'xhr loadstart 1',
				'upload loadstart 1',
				'upload loadend 1',
				'xhr onreadystatechange 2',
				// we expect no onreadystatechange readyState=3 event because there is no loading content
				'xhr onreadystatechange 4',
				'xhr load 4',
				'xhr loadend 4'
			];
		}
		// Override expectations if provided.
		if(params.expectedContentType)
			expectedHeaders['X-Request-Content-Type'] = params.expectedContentType;

		let xhr = new XMLHttpRequest();

		xhr.upload.onloadstart = (e) => {
			actual.push('upload loadstart ' + xhr.readyState);
		};

		xhr.upload.onprogress = (e) => {
			// events every 50ms, one final when uploading is done
			if(xhr.readyState >= xhr.HEADERS_RECEIVED) {
				assert.strictEqual(xhr.status, 200, 'JS never gets to see the 30x status code');
			}
			progressFiredReadyState1 = xhr.readyState === xhr.OPENED;
		};

		xhr.upload.onloadend = () => {
			actual.push('upload loadend ' + xhr.readyState);
		};

		xhr.onloadstart = () => {
			actual.push('xhr loadstart ' + xhr.readyState);
		};

		xhr.onreadystatechange = () => {
			if(xhr.readyState >= xhr.HEADERS_RECEIVED) {
				assert.strictEqual(xhr.status, 200, 'JS never gets to see the 30x status code');
			}

			// The UA may fire multiple 'readystatechange' events while in
			// the 'loading' state.
			// https://xhr.spec.whatwg.org/#the-send()-method
			if(xhr.readyState === 3 && actual[actual.length - 1] === 'xhr onreadystatechange 3') {
				return;
			}

			actual.push('xhr onreadystatechange ' + xhr.readyState);
		};

		xhr.onload = (e) => {
			actual.push('xhr load ' + xhr.readyState);
		};

		xhr.onloadend = (e) => {
			actual.push('xhr loadend ' + xhr.readyState);

			assert(progressFiredReadyState1, 'One progress event should fire on xhr.upload when readyState is 1');

			// Headers will tell us if data was sent when expected
			for(let header in expectedHeaders){
				assert.strictEqual(xhr.getResponseHeader(header), expectedHeaders[header], header);
			}

			assert.deepStrictEqual(actual, expectedEvents, 'events firing in expected order and states');

			if(params.expectedBody)
				assert.strictEqual(xhr.response, params.expectedBody, 'request body was resent');

			xhr.upload.onloadstart = null;
			xhr.upload.onprogress  = null;
			xhr.upload.onloadend   = null;

			xhr.onloadstart = null;
			xhr.onprogress  = null;
			xhr.onload      = null;
			xhr.onloadend   = null;
		};

		xhr.open('POST', `${activeURL}/redirect.py?location=/xhr/resources/content.py&code=${params.code}`);
		xhr.send(params.body);
	}
}
﻿
/*
 * send-redirect-post-upload.htm
 *

<!DOCTYPE html>
<html>
<head>
    <link rel="help" href="https://xhr.spec.whatwg.org/#handler-xhr-onprogress" data-tested-assertations="../.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#event-xhr-progress" data-tested-assertations="../.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-send()-method" data-tested-assertations="following::dt[@id="dom-xmlhttprequest-send-bodyinit"]/following::dd[1]/p[2] following::ol[1]/li[9]//li[1] following::ol[1]/li[9]//li[2]" />
    <link rel="help" href="https://fetch.spec.whatwg.org/#http-fetch" data-tested-assertations="following::ol[1]/li[6]/dl/dd[1]//dd[3]" />
    <link rel="help" href="https://fetch.spec.whatwg.org/#concept-http-redirect-fetch" data-tested-assertations="following::li[16]" />
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <title>XMLHttpRequest: The send() method: POSTing to URL that redirects</title>
</head>

<body>
    <div id="log"></div>

    <script type="text/javascript">
    function testRedirectPost(params) {
        var test = async_test(document.title + " (" + params.name + ")");
        var actual = [];
        // We check upload.onprogress with a boolean because it *might* fire more than once
        var progressFiredReadyState1 = false;

        var expectedHeaders, expectedEvents;

        // 307 redirects should resend the POST data, and events and headers will be a little different..
        if(params.expectResendPost) {
            expectedHeaders = {
                "X-Request-Content-Length": "12000",
                "X-Request-Content-Type": "text/plain;charset=UTF-8",
                "X-Request-Method": "POST",
                "X-Request-Query": "NO",
                "Content-Length": "12000"
            }
            expectedEvents = [
                "xhr onreadystatechange 1",
                "xhr loadstart 1",
                "upload loadstart 1",
                "upload loadend 1",
                "xhr onreadystatechange 2",
                "xhr onreadystatechange 3",
                "xhr onreadystatechange 4",
                "xhr load 4",
                "xhr loadend 4"
            ];
        } else {
            // setting the right expectations for POST resent as GET without request body
            expectedHeaders = {
                "X-Request-Content-Length": "NO",
                "X-Request-Content-Type": "NO",
                "X-Request-Method": "GET",
                "X-Request-Query": "NO"
            }
            expectedEvents = [
                "xhr onreadystatechange 1",
                "xhr loadstart 1",
                "upload loadstart 1",
                "upload loadend 1",
                "xhr onreadystatechange 2",
                // we expect no onreadystatechange readyState=3 event because there is no loading content
                "xhr onreadystatechange 4",
                "xhr load 4",
                "xhr loadend 4"
            ];
        }
        // Override expectations if provided.
        if(params.expectedContentType)
          expectedHeaders["X-Request-Content-Type"] = params.expectedContentType;

        test.step(function()
        {
            var xhr = new XMLHttpRequest();

            xhr.upload.onloadstart = test.step_func(function(e) {
                actual.push("upload loadstart " + xhr.readyState);
            });
            xhr.upload.onprogress = test.step_func(function(e) {
                // events every 50ms, one final when uploading is done
                if(xhr.readyState >= xhr.HEADERS_RECEIVED) {
                    assert_equals(xhr.status, 200, "JS never gets to see the 30x status code");
                }
                progressFiredReadyState1 = xhr.readyState === xhr.OPENED;
            });
            xhr.upload.onloadend = test.step_func(function() {
                actual.push("upload loadend " + xhr.readyState);
            });
            xhr.onloadstart = test.step_func(function() {
                actual.push("xhr loadstart " + xhr.readyState);
            });
            xhr.onreadystatechange = test.step_func(function() {
                if(xhr.readyState >= xhr.HEADERS_RECEIVED) {
                    assert_equals(xhr.status, 200, "JS never gets to see the 30x status code");
                }

                // The UA may fire multiple "readystatechange" events while in
                // the "loading" state.
                // https://xhr.spec.whatwg.org/#the-send()-method
                if (xhr.readyState === 3 && actual[actual.length - 1] === "xhr onreadystatechange 3") {
                    return;
                }

                actual.push("xhr onreadystatechange " + xhr.readyState);
            });
            xhr.onload = test.step_func(function(e)
            {
                actual.push("xhr load " + xhr.readyState);
            });
            xhr.onloadend = test.step_func(function(e)
            {
                actual.push("xhr loadend " + xhr.readyState);

                assert_true(progressFiredReadyState1, "One progress event should fire on xhr.upload when readyState is 1");

                // Headers will tell us if data was sent when expected
                for(var header in expectedHeaders) {
                    assert_equals(xhr.getResponseHeader(header), expectedHeaders[header], header);
                }

                assert_array_equals(actual, expectedEvents, "events firing in expected order and states");
                if (params.expectedBody)
                  assert_equals(xhr.response, params.expectedBody, 'request body was resent');
                test.done();
            });

            xhr.open("POST", "./resources/redirect.py?location=content.py&code=" + params.code, true);
            xhr.send(params.body);
        });
    }

    const stringBody = "Test Message".repeat(1000);
    const blobBody = new Blob(new Array(1000).fill("Test Message"));

    testRedirectPost({name: "301", code: 301, expectResendPost: false, body: stringBody});
    testRedirectPost({name: "302", code: 302, expectResendPost: false, body: stringBody});
    testRedirectPost({name: "303", code: 303, expectResendPost: false, body: stringBody});
    testRedirectPost({name: "307 (string)", code: 307, expectResendPost: true,  body: stringBody, expectedBody: stringBody });
    testRedirectPost({name: "307 (blob)", code: 307, expectResendPost: true, body: blobBody, expectedBody: stringBody, expectedContentType: "NO" });
    </script>
</body>
</html>

 *
 * send-redirect-post-upload.htm
 */
