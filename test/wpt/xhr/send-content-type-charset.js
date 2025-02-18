import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	request(
		'text; charset=ascii',
		'text; charset=ascii',
		'header with invalid MIME type is not changed'
	);
	request(
		'',
		'',
		'header with invalid MIME type (empty string) is not changed'
	);
	request(
		'charset=ascii',
		'charset=ascii',
		'known charset but bogus header - missing MIME type'
	);
	request(
		'charset=bogus',
		'charset=bogus',
		'bogus charset and bogus header - missing MIME type'
	);
	request(
		'text/plain;charset=utf-8',
		'text/plain;charset=utf-8',
		'If charset= param is UTF-8 (case-insensitive), it should not be changed'
	);
	request(
		'text/x-pink-unicorn',
		'text/x-pink-unicorn',
		'If no charset= param is given, implementation should not add one - unknown MIME'
	);
	request(
		'text/plain',
		'text/plain',
		'If no charset= param is given, implementation should not add one - known MIME'
	);
	request(
		'text/plain;  hi=bye',
		'text/plain;  hi=bye',
		'If no charset= param is given, implementation should not add one - known MIME, unknown param, two spaces'
	);
	request(
		'text/x-thepiano;charset= waddup',
		'text/x-thepiano;charset=UTF-8',
		'charset given but wrong, fix it (unknown MIME, bogus charset)'
	);
//	//	request(
//	//		'text/plain;charset=utf-8;charset=waddup',
//	//		'text/plain;charset=utf-8;charset=waddup',
//	//		'If charset= param is UTF-8 (case-insensitive), it should not be changed (bogus charset)'
//	//	);
	request(
		'text/plain;charset=shift-jis',
		'text/plain;charset=UTF-8',
		'charset given but wrong, fix it (known MIME, actual charset)'
	);
//	//	request(
//	//		'text/x-pink-unicorn; charset=windows-1252; charset=bogus; notrelated; charset=ascii',
//	//		'text/x-pink-unicorn;charset=UTF-8',
//	//		'Multiple non-UTF-8 charset parameters deduplicate, bogus parameter dropped'
//	//	);
	request(
		null,
		'text/plain;charset=UTF-8',
		'No content type set, give MIME and charset'
	);
//	//	request(
//	//		'text/plain;charset= utf-8',
//	//		'text/plain;charset=UTF-8',
//	//		'charset with leading space that is UTF-8 does change'
//	//	);
	request(
		'text/plain;charset=utf-8 ;x=x',
		'text/plain;charset=utf-8 ;x=x',
		'charset with trailing space that is UTF-8 does not change'
	);
	request(
		'text/plain;charset=\"utf-8\"',
		'text/plain;charset=\"utf-8\"',
		'charset in double quotes that is UTF-8 does not change'
	);
	request(
		'text/plain;charset=\" utf-8\"',
		'text/plain;charset=UTF-8',
		'charset in double quotes with space'
	);
	request(
		'text/plain;charset=\"u\\t\\f-8\"',
		'text/plain;charset=\"u\\t\\f-8\"',
		'charset in double quotes with backslashes that is UTF-8 does not change'
	);
	request(
		'YO/yo;charset=x;yo=YO; X=y',
		'yo/yo;charset=UTF-8;yo=YO;x=y',
		'unknown parameters need to be preserved'
	);

	function request(input, output, title){

		let xhr = new XMLHttpRequest();

		xhr.open('POST', `${activeURL}/content.py`, false);

		if(input !== null)
			xhr.setRequestHeader('Content-Type', input);

		xhr.send('TEST');

		assert.strictEqual(xhr.responseText, 'TEST');
		assert.strictEqual(xhr.getResponseHeader('x-request-content-type'), output, title);
	}
}
﻿
/*
 * send-content-type-charset.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: send() - charset parameter of Content-Type</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
  </head>
  <body>
    <div id="log"></div>
    <script>
      function request(input, output, title) {
        title = title || document.title + ' - ' + input;
        test(function() {
        var client = new XMLHttpRequest()
        client.open("POST", "resources/content.py", false)
        if(input !== null)
          client.setRequestHeader("Content-Type", input)
        client.send("TEST")
        assert_equals(client.responseText, "TEST")
        assert_equals(client.getResponseHeader("x-request-content-type"), output)
        }, title)
      }

      request(
        "text; charset=ascii",
        "text; charset=ascii",
        "header with invalid MIME type is not changed"
      )
      request(
        "",
        "",
        "header with invalid MIME type (empty string) is not changed"
      )
      request(
        "charset=ascii",
        "charset=ascii",
        "known charset but bogus header - missing MIME type"
      )
      request(
        "charset=bogus",
        "charset=bogus",
        "bogus charset and bogus header - missing MIME type"
      )
      request(
        "text/plain;charset=utf-8",
        "text/plain;charset=utf-8",
        "If charset= param is UTF-8 (case-insensitive), it should not be changed"
      )
      request(
        "text/x-pink-unicorn",
        "text/x-pink-unicorn",
        "If no charset= param is given, implementation should not add one - unknown MIME"
      )
      request(
        "text/plain",
        "text/plain",
        "If no charset= param is given, implementation should not add one - known MIME"
      )
      request(
        "text/plain;  hi=bye",
        "text/plain;  hi=bye",
        "If no charset= param is given, implementation should not add one - known MIME, unknown param, two spaces"
      )
      request(
        "text/x-thepiano;charset= waddup",
        "text/x-thepiano;charset=UTF-8",
        "charset given but wrong, fix it (unknown MIME, bogus charset)"
      )
      request(
        "text/plain;charset=utf-8;charset=waddup",
        "text/plain;charset=utf-8;charset=waddup",
        "If charset= param is UTF-8 (case-insensitive), it should not be changed (bogus charset)"
      )
      request(
        "text/plain;charset=shift-jis",
        "text/plain;charset=UTF-8",
        "charset given but wrong, fix it (known MIME, actual charset)"
      )
      request(
        "text/x-pink-unicorn; charset=windows-1252; charset=bogus; notrelated; charset=ascii",
        "text/x-pink-unicorn;charset=UTF-8",
        "Multiple non-UTF-8 charset parameters deduplicate, bogus parameter dropped"
      )
      request(
        null,
        "text/plain;charset=UTF-8",
        "No content type set, give MIME and charset"
      )
      request(
        "text/plain;charset= utf-8",
        "text/plain;charset=UTF-8",
        "charset with leading space that is UTF-8 does change")
      request(
        "text/plain;charset=utf-8 ;x=x",
        "text/plain;charset=utf-8 ;x=x",
        "charset with trailing space that is UTF-8 does not change");
      request(
        "text/plain;charset=\"utf-8\"",
        "text/plain;charset=\"utf-8\"",
        "charset in double quotes that is UTF-8 does not change")
      request(
        "text/plain;charset=\" utf-8\"",
        "text/plain;charset=UTF-8",
        "charset in double quotes with space")
      request(
        "text/plain;charset=\"u\\t\\f-8\"",
        "text/plain;charset=\"u\\t\\f-8\"",
        "charset in double quotes with backslashes that is UTF-8 does not change")
      request(
        "YO/yo;charset=x;yo=YO; X=y",
        "yo/yo;charset=UTF-8;yo=YO;x=y",
        "unknown parameters need to be preserved")
    </script>
  </body>
</html>

 *
 * send-content-type-charset.htm
 */
