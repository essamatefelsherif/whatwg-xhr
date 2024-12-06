import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	XMLHttpRequest.prototype.test = () => {
		return 'TEH';
	};

	const xhr = new XMLHttpRequest();

	assert(xhr.test(), 'TEH');
	const members = [
		'onreadystatechange',
		'open',
		'setRequestHeader',
		'send',
		'abort',
		'status',
		'statusText',
		'getResponseHeader',
		'getAllResponseHeaders',
		'responseText',
		'responseXML'
	];

	for(let x of members)
		assert(x in xhr, `${x} not found`);

	const constants = [
		'UNSENT',
		'OPENED',
		'HEADERS_RECEIVED',
		'LOADING',
		'DONE'
	];

	let i = 0;
	for(let x of constants){
		assert(x in xhr, `${x} not found`);
		assert.equal(xhr[x], i, `${x} not equal to ${i}`);
		i++;
	}
}

/*
 * xmlhttprequest-basic.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: prototype and members</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <link rel="help" href="https://xhr.spec.whatwg.org/#dom-xmlhttprequest" data-tested-assertations="following::ol/li[1]" />
    <link rel="help" href="https://xhr.spec.whatwg.org/#xmlhttprequest" data-tested-assertations="." />
    <link rel="help" href="https://xhr.spec.whatwg.org/#states" data-tested-assertations="following::dfn[2] following::dfn[3] following::dfn[4] following::dfn[5] following::dfn[6]" />
  </head>
  <body>
    <div id="log"></div>
    <script>
      test(function() {
        XMLHttpRequest.prototype.test = function() { return "TEH" }
        var client = new XMLHttpRequest()
        assert_equals(client.test(), "TEH")
        var members = ["onreadystatechange",
                       "open",
                       "setRequestHeader",
                       "send",
                       "abort",
                       "status",
                       "statusText",
                       "getResponseHeader",
                       "getAllResponseHeaders",
                       "responseText",
                       "responseXML"]
        for(var x in members)
          assert_true(members[x] in client, members[x])
        var constants = ["UNSENT",
                         "OPENED",
                         "HEADERS_RECEIVED",
                         "LOADING",
                         "DONE"],
            i = 0
        for(var x in constants) {
          assert_equals(client[constants[x]], i, constants[x])
          assert_equals(XMLHttpRequest[constants[x]], i, "XHR " + constants[x])
          i++
        }
      })
    </script>
  </body>
</html>

 *
 * xmlhttprequest-basic.htm
 */
