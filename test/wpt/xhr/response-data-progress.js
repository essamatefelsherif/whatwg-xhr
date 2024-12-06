import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

let debugSeq = 0;

export default (activeURL) => {

	(async () => {

		let p1 = new Promise((resolve) => {
			var xhr = doTest(false, 0, `${activeURL}/trickle.py?count=6&delay=150`);
			xhr.onloadend = () => {
				resolve('test#1 done');
			};
		});

		let p2 = new Promise((resolve) => {
			var xhr  = doTest(true, 78, `${activeURL}/trickle.py?count=6&delay=150&specifylength=1`);
			xhr.onloadend = () => {
				resolve('test#2 done');
			};
		});

		await Promise.all([p1, p2]);
	})();

	function doTest(expectedLengthComputable, expectedTotal, url){

		let xhr = new XMLHttpRequest();
		let lastSize = 0;

		xhr.onprogress = (e) => {

			assert.strictEqual(e.total, expectedTotal);
			assert.strictEqual(e.lengthComputable, expectedLengthComputable);

			let currentSize = xhr.responseText.length;

			if (lastSize > 0 && currentSize > lastSize) {
				// growth from a positive size to bigger!
				xhr.onprogress = xhr.onreadystatechange = null;
			}

			lastSize = currentSize;
		};

		xhr.onreadystatechange = () => {

			if(xhr.readyState === 4){
				assert(false, 'onprogress not called multiple times, or response body did not grow.');
			}
		};

		xhr.open('GET', url);
		xhr.send();

		return xhr;
	}
}
﻿
/*
 * response-data-progress.htm
 *

<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>XMLHttpRequest: progress events grow response body size</title>
    <meta name="timeout" content="long">
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-send()-method" data-tested-assertations="following::a[contains(@href,'#make-progress-notifications')]/.. following::a[contains(@href,'#make-progress-notifications')]/../following:p[1]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#make-progress-notifications" data-tested-assertations=".." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#handler-xhr-onprogress" data-tested-assertations="/../.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#event-xhr-progress" data-tested-assertations="/../.." />
</head>

<div id="log"></div>

<script>

function doTest(test, expectedLengthComputable, expectedTotal, url) {
    var client = new XMLHttpRequest();
    var lastSize = 0;

    client.onprogress = test.step_func(function(e) {
        assert_equals(e.total, expectedTotal);
        assert_equals(e.lengthComputable, expectedLengthComputable);

        var currentSize = client.responseText.length;

        if (lastSize > 0 && currentSize > lastSize) {
            // growth from a positive size to bigger!
            test.done();
        }

        lastSize = currentSize;
    });

    client.onreadystatechange = test.step_func(function() {
        if (client.readyState === 4) {
            assert_unreached("onprogress not called multiple times, or response body did not grow.");
        }
    });

    client.open("GET", url);
    client.send(null);
    return client;
}

async_test(function () { doTest(this, false, 0, "resources/trickle.py?count=6&delay=150"); },
           document.title + ', unknown content-length');
async_test(function () { doTest(this, true, 78, "resources/trickle.py?count=6&delay=150&specifylength=1"); },
           document.title + ', known content-length');
</script>

 *
 * response-data-progress.htm
 */
