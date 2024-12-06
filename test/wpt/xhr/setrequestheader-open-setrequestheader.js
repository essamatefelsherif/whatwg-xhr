import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	xhr.open('GET', `${activeURL}/inspect-headers.py?filter_name=x-appended-to-this`);
	xhr.setRequestHeader('X-appended-to-this', 'False');

	xhr.open('GET', `${activeURL}/inspect-headers.py?filter_name=x-appended-to-this`);
	xhr.setRequestHeader('X-appended-to-this', 'True');

	xhr.onreadystatechange = () => {

		if(xhr.readyState === 4){
			assert.strictEqual(xhr.responseText, 'X-appended-to-this: True\n', 'Set headers record should have been cleared by open.');
			test_standard_header();
		}
	};

	xhr.send();

	function test_standard_header(){
		let header_tested = 'Accept';
		let xhr = new XMLHttpRequest();

		xhr.open('GET', `${activeURL}/inspect-headers.py?filter_name=accept`);
		xhr.setRequestHeader('Accept', 'foo/bar');

		xhr.open('GET', `${activeURL}/inspect-headers.py?filter_name=accept`);
		xhr.setRequestHeader('Accept', 'bar/foo');

		xhr.onreadystatechange = () => {

			if(xhr.readyState === 4){
				assert.strictEqual(xhr.responseText, 'Accept: bar/foo\n', 'Set headers record should have been cleared by open.');
			}
		};
/**/
		xhr.send();
	}
}

/*
 * setrequestheader-open-setrequestheader.htm
 *

<!DOCTYPE html>
<!--
Test from https://bugzilla.mozilla.org/show_bug.cgi?id=819051
-->
<head>
  <title>XMLHttpRequest: setRequestHeader() and open()</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-open()-method">
    <link rel="help" href="https://xhr.spec.whatwg.org/#the-setrequestheader()-method">
</head>
<body>
    <p id="log"></p>
<script type="text/javascript">
async_test(test => {

var url = "resources/inspect-headers.py";

var xhr = new XMLHttpRequest();
xhr.open("GET", url + "?filter_name=x-appended-to-this");
xhr.setRequestHeader("X-appended-to-this", "False");
xhr.open("GET", url + "?filter_name=x-appended-to-this");
xhr.setRequestHeader("X-appended-to-this", "True");

xhr.onreadystatechange = test.step_func(() => {
    if (xhr.readyState == 4) {
        assert_equals(xhr.responseText, "X-appended-to-this: True\n", "Set headers record should have been cleared by open.");
        test_standard_header();
    }
})

xhr.send();

function test_standard_header () {
    var header_tested = "Accept";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url + "?filter_name=accept");
    xhr.setRequestHeader("Accept", "foo/bar");
    xhr.open("GET", url + "?filter_name=accept");
    xhr.setRequestHeader("Accept", "bar/foo");

    xhr.onreadystatechange = test.step_func(() => {
        if (xhr.readyState == 4) {
            assert_equals(xhr.responseText, "Accept: bar/foo\n", "Set headers record should have been cleared by open.");
            test.done();
        }
    })

    xhr.send();
}

})
</script>

 *
 * setrequestheader-open-setrequestheader.htm
 */
