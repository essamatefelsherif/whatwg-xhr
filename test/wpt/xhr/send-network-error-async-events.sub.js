import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	let expect =  [
		'loadstart',
		'upload.loadstart',
		4,
		'upload.error',
		'upload.loadend',
		'error',
		'loadend'
	];
	let actual = [];

 	xhr.onreadystatechange = () => {
		if(xhr.readyState === 4){
			actual.push(xhr.readyState);
		}
	};

	xhr.onloadstart = (e) => {
		actual.push(e.type);
	};

	xhr.onloadend = (e) => {
		actual.push(e.type);
		assert.deepStrictEqual(actual, expect);
	};

	xhr.onerror = (e) => {
		actual.push(e.type);
	};

	xhr.upload.onloadstart = (e) => { actual.push("upload." + e.type); };
	xhr.upload.onloadend   = (e) => { actual.push("upload." + e.type); };
	xhr.upload.onerror     = (e) => { actual.push("upload." + e.type); };

	xhr.open('POST', `http://nonexistent`);
	xhr.send('Test Message');
}
﻿
/*
 * send-network-error-async-events.sub.htm
 *

<!DOCTYPE html>
<html>
<head>
    <link rel="help" href="https://xhr.spec.whatwg.org/#handler-xhr-onerror" data-tested-assertations="../.." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-send()-method" data-tested-assertations="following::ol[1]/li[9]/ol/li[2] following::ol[1]/li[9]/ol/li[3]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#infrastructure-for-the-send()-method" data-tested-assertations="following::dt[4] following::dd[4]/p" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#network-error" data-tested-assertations=".." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#request-error" data-tested-assertations="following::ol[1]/li[4] following::ol[1]/li[6] following::ol[1]/li[7] following::ol[1]/li[7]/ol/li[3] following::ol[1]/li[7]/ol/li[4] following::ol[1]/li[9] following::ol[1]/li[10]" />
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <title>XMLHttpRequest: The send() method: Fire a progress event named error when Network error happens (synchronous flag is unset)</title>
</head>

<body>
    <div id="log"></div>

    <script type="text/javascript">
        var test = async_test();

        test.step(function(){
            var xhr = new XMLHttpRequest();
            var expect =  ["loadstart", "upload.loadstart", 4, "upload.error", "upload.loadend", "error", "loadend"];
            var actual = [];

            xhr.onreadystatechange = test.step_func(() => {
                if (xhr.readyState == 4) {
                    actual.push(xhr.readyState);
                }
            });

            xhr.onloadstart        = test.step_func(e => { actual.push(e.type); })
            xhr.onloadend          = test.step_func_done(e => {
                actual.push(e.type);
                assert_array_equals(actual, expect);
            })
            xhr.onerror            = test.step_func(e => { actual.push(e.type); })

            xhr.upload.onloadstart = test.step_func(e => { actual.push("upload." + e.type); })
            xhr.upload.onloadend   = test.step_func(e => { actual.push("upload." + e.type); })
            xhr.upload.onerror     = test.step_func(e => { actual.push("upload." + e.type); })

            xhr.open("POST", "http://nonexistent.{{host}}:{{ports[http][0]}}", true);
            xhr.send("Test Message");
        });
    </script>
</body>
</html>

 *
 * send-network-error-async-events.sub.htm
 */
