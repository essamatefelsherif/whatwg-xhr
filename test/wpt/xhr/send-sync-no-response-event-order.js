import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let expect = [4, 'load', 'loadend'];
	let actual = [];

	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = () => {

		if(xhr.readyState === 4){
			actual.push(xhr.readyState);
		}
	};

	xhr.onloadstart        = (e) => { actual.push(e.type); };
	xhr.onload             = (e) => { actual.push(e.type); };
	xhr.onloadend          = (e) => { actual.push(e.type); };

	xhr.upload.onload      = (e) => { actual.push('upload.' + e.type); };
	xhr.upload.onloadstart = (e) => { actual.push('upload.' + e.type); };
	xhr.upload.onloadend   = (e) => { actual.push('upload.' + e.type); };

	xhr.open('POST', `${activeURL}/content.py`, false);
	xhr.send();

	assert.strictEqual(xhr.response, '');
	assert.deepStrictEqual(actual, expect);
}
﻿
/*
 * send-sync-no-response-event-order.htm
 *

<!DOCTYPE html>
<html>
<head>
    <title>XMLHttpRequest: The send() method: event order when synchronous flag is set and there is no response entity body</title>
    <link rel="help" href="https://xhr.spec.whatwg.org/#handler-xhr-onloadstart" data-tested-assertations="../.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#handler-xhr-onloadend" data-tested-assertations="../.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#event-xhr-loadstart" data-tested-assertations="../.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#event-xhr-loadend" data-tested-assertations="../.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-send()-method" data-tested-assertations="following-sibling::ol[1]/li[9]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#same-origin-request-steps" data-tested-assertations="following::DL[1]/DT[1]"/>
    <link rel="help" href="https://xhr.spec.whatwg.org/#infrastructure-for-the-send()-method" data-tested-assertations="following::dt[11] following::a[contains(@href,'#switch-done')]/.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#switch-done" data-tested-assertations="following::ol[1]/li[1] following::ol[1]/li[3] following::ol[1]/li[4] following::ol[1]/li[6] following::ol[1]/li[7]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-response-attribute" data-tested-assertations="following::ol/li[3]" />
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
</head>

<body>
    <div id="log"></div>

    <script type="text/javascript">
        test(function () {
            var xhr = new XMLHttpRequest();
            var expect = [4, "load", "loadend"];
            var actual = [];

            xhr.onreadystatechange = function()
            {
                if (xhr.readyState == 4)
                {
                    actual.push(xhr.readyState);
                }
            };

            xhr.onloadstart        = function(e){ actual.push(e.type); };
            xhr.onload             = function(e){ actual.push(e.type); };
            xhr.onloadend          = function(e){ actual.push(e.type); };

            xhr.upload.onload      = function(e){ actual.push("upload." + e.type); };
            xhr.upload.onloadstart = function(e){ actual.push("upload." + e.type); };
            xhr.upload.onloadend   = function(e){ actual.push("upload." + e.type);};

            xhr.open("POST", "./resources/content.py", false);
            xhr.send();

            assert_equals(xhr.response, "");
            assert_array_equals(actual, expect);
        });
    </script>
</body>
</html>

 *
 * send-sync-no-response-event-order.htm
 */
