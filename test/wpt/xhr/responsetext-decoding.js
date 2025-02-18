import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	const encoded_content         = "%e6%a9%9f";
	const decoded_as_windows_1252 = "\u00e6\u00a9\u0178";
	const decoded_as_utf_8        = "\u6a5f";

	const encoded_xml                  = create_encoded_xml(encoded_content);
	const encoded_html                 = create_encoded_html(encoded_content);
	const xml_decoded_as_windows_1252  = create_xml(decoded_as_windows_1252);
	const xml_decoded_as_utf_8         = create_xml(decoded_as_utf_8);
	const html_decoded_as_windows_1252 = create_html(decoded_as_windows_1252);
	const html_decoded_as_utf_8        = create_html(decoded_as_utf_8);

	// 'default' response type
	// An XML-ish response is sniffed.

	request('application/xml', encoded_xml, xml_decoded_as_windows_1252);

	// An HTML-ish response isn't sniffed.

	request('text/html',                            encoded_html, html_decoded_as_utf_8);
	request('application/xml;charset=utf-8',        encoded_xml,  xml_decoded_as_utf_8);
	request('application/xml;charset=windows-1252', encoded_xml,  xml_decoded_as_windows_1252);
	request('text/html;charset=utf-8',              encoded_html, html_decoded_as_utf_8);
	request('text/html;charset=windows-1252',       encoded_html, html_decoded_as_windows_1252);

	request('text/plain;charset=windows-1252', '%FF', '\u00FF');

	request('text/plain', '%FF', '\uFFFD');
	request('text/plain', '%FE%FF', '');
	request('text/plain', '%FE%FF%FE%FF', '\uFEFF');
	request('text/plain', '%EF%BB%BF', '');
	request('text/plain', '%EF%BB%BF%EF%BB%BF', '\uFEFF');
	request('text/plain', '%C2', '\uFFFD');

	request('text/xml',   '%FE%FF',             '');
	request('text/xml',   '%FE%FF%FE%FF',       '\uFEFF');
	request('text/xml',   '%EF%BB%BF',          '');
	request('text/xml',   '%EF%BB%BF%EF%BB%BF', '\uFEFF');
	request('text/plain', '%E3%81%B2',          '\u3072');

	// 'text' response type
	// An XML-ish response isn't sniffed.

	request('application/xml', encoded_xml, xml_decoded_as_utf_8, 'text');

	// An HTML-ish response isn't sniffed.

	request('text/html',                            encoded_html, html_decoded_as_utf_8, 'text');
	request('application/xml;charset=utf-8',        encoded_xml, xml_decoded_as_utf_8, 'text');
	request('application/xml;charset=windows-1252', encoded_xml, xml_decoded_as_windows_1252, 'text');
	request('text/html;charset=utf-8',              encoded_html, html_decoded_as_utf_8, 'text');
	request('text/html;charset=windows-1252',       encoded_html, html_decoded_as_windows_1252, 'text');

	request('text/plain;charset=windows-1252', '%FF', '\u00FF', 'text');
	request('text/plain', '%FF', '\uFFFD', 'text');
	request('text/plain', '%FE%FF', '', 'text');
	request('text/plain', '%FE%FF%FE%FF', '\uFEFF', 'text');
	request('text/plain', '%EF%BB%BF', '', 'text');
	request('text/plain', '%EF%BB%BF%EF%BB%BF', '\uFEFF', 'text');
	request('text/plain', '%C2', '\uFFFD', 'text');
	request('text/plain;charset=bogus', '%C2', '\uFFFD', 'text');
	request('text/xml', '%FE%FF', '', 'text');
	request('text/xml', '%FE%FF%FE%FF', '\uFEFF', 'text');
	request('text/xml', '%EF%BB%BF', '', 'text');
	request('text/xml', '%EF%BB%BF%EF%BB%BF', '\uFEFF', 'text');
	request('text/plain', '%E3%81%B2', '\u3072', 'text');

	function create_html(content){
		return '<!doctype html><meta charset=windows-1252><x>' + content + '</x>';
	}

	function create_encoded_html(encoded_content){
		return encodeURIComponent('<!doctype html><meta charset=windows-1252><x>') + encoded_content + encodeURIComponent('<\/x>');
	}

	function create_xml(content){
		return '<?xml version="1.0" encoding="windows-1252"?><x>' + content + '</x>';
	}

	function create_encoded_xml(encoded_content){
		return encodeURIComponent('<?xml version="1.0" encoding="windows-1252"?><x>') + encoded_content + encodeURIComponent('<\/x>');
	}

	function request(type, input, output, responseType){

		const xhr = new XMLHttpRequest();

		if(responseType !== undefined) {
			xhr.responseType = responseType;
		}

		xhr.open('GET', `${activeURL}/status.py?content=${input}&type=${encodeURIComponent(type)}`, true);

		xhr.onload = () => {
			assert.strictEqual(xhr.responseText, output);
		};

		xhr.send();
	}
}
﻿
/*
 * responsetext-decoding.htm
 *

<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>XMLHttpRequest: responseText decoding</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
  </head>
  <body>
    <script>
      function create_html(content) {
        return "<!doctype html><meta charset=windows-1252><x>" + content + "</x>";
      }
      function create_encoded_html(encoded_content) {
        return encodeURIComponent("<!doctype html><meta charset=windows-1252><x>") + encoded_content + encodeURIComponent("<\/x>");
      }
      function create_xml(content) {
        return "<?xml version='1.0' encoding='windows-1252'?><x>" + content + "</x>";
      }
      function create_encoded_xml(encoded_content) {
        return encodeURIComponent("<?xml version='1.0' encoding='windows-1252'?><x>") + encoded_content + encodeURIComponent("<\/x>");
      }
      function request(type, input, output, responseType) {
        async_test((test) => {
          const client = new XMLHttpRequest();
          if (responseType !== undefined) {
            client.responseType = responseType;
          }
          client.open("GET", "resources/status.py?content=" + input + "&type=" + encodeURIComponent(type), true);
          client.onload = test.step_func_done(() => {
            assert_equals(client.responseText, output);
          })
          client.send(null);
        }, document.title + " (" + type + " " + input + " " + (responseType ? " " + responseType : "empty") + ")");
      }

      const encoded_content = "%e6%a9%9f";
      const decoded_as_windows_1252 = "\u00e6\u00a9\u0178";
      const decoded_as_utf_8 = "\u6a5f";
      const encoded_xml = create_encoded_xml(encoded_content);
      const encoded_html = create_encoded_html(encoded_content);
      const xml_decoded_as_windows_1252 = create_xml(decoded_as_windows_1252);
      const xml_decoded_as_utf_8 = create_xml(decoded_as_utf_8);
      const html_decoded_as_windows_1252 = create_html(decoded_as_windows_1252);
      const html_decoded_as_utf_8 = create_html(decoded_as_utf_8);

      // "default" response type
      // An XML-ish response is sniffed.
      request("application/xml", encoded_xml, xml_decoded_as_windows_1252);
      // An HTML-ish response isn't sniffed.
      request("text/html", encoded_html, html_decoded_as_utf_8);
      request("application/xml;charset=utf-8", encoded_xml, xml_decoded_as_utf_8);
      request("application/xml;charset=windows-1252", encoded_xml, xml_decoded_as_windows_1252);
      request("text/html;charset=utf-8", encoded_html, html_decoded_as_utf_8);
      request("text/html;charset=windows-1252", encoded_html, html_decoded_as_windows_1252);
      request("text/plain;charset=windows-1252", "%FF", "\u00FF");
      request("text/plain", "%FF", "\uFFFD");
      request("text/plain", "%FE%FF", "");
      request("text/plain", "%FE%FF%FE%FF", "\uFEFF");
      request("text/plain", "%EF%BB%BF", "");
      request("text/plain", "%EF%BB%BF%EF%BB%BF", "\uFEFF");
      request("text/plain", "%C2", "\uFFFD");
      request("text/xml", "%FE%FF", "");
      request("text/xml", "%FE%FF%FE%FF", "\uFEFF");
      request("text/xml", "%EF%BB%BF", "");
      request("text/xml", "%EF%BB%BF%EF%BB%BF", "\uFEFF");
      request("text/plain", "%E3%81%B2", "\u3072");

      // "text" response type
      // An XML-ish response isn't sniffed.
      request("application/xml", encoded_xml, xml_decoded_as_utf_8, "text");
      // An HTML-ish response isn't sniffed.
      request("text/html", encoded_html, html_decoded_as_utf_8, "text");
      request("application/xml;charset=utf-8", encoded_xml, xml_decoded_as_utf_8, "text");
      request("application/xml;charset=windows-1252", encoded_xml, xml_decoded_as_windows_1252, "text");
      request("text/html;charset=utf-8", encoded_html, html_decoded_as_utf_8, "text");
      request("text/html;charset=windows-1252", encoded_html, html_decoded_as_windows_1252, "text");
      request("text/plain;charset=windows-1252", "%FF", "\u00FF", "text");
      request("text/plain", "%FF", "\uFFFD", "text");
      request("text/plain", "%FE%FF", "", "text");
      request("text/plain", "%FE%FF%FE%FF", "\uFEFF", "text");
      request("text/plain", "%EF%BB%BF", "", "text");
      request("text/plain", "%EF%BB%BF%EF%BB%BF", "\uFEFF", "text");
      request("text/plain", "%C2", "\uFFFD", "text");
      request("text/plain;charset=bogus", "%C2", "\uFFFD", "text");
      request("text/xml", "%FE%FF", "", "text");
      request("text/xml", "%FE%FF%FE%FF", "\uFEFF", "text");
      request("text/xml", "%EF%BB%BF", "", "text");
      request("text/xml", "%EF%BB%BF%EF%BB%BF", "\uFEFF", "text");
      request("text/plain", "%E3%81%B2", "\u3072", "text");
    </script>
  </body>
</html>

 *
 * responsetext-decoding.htm
 */
