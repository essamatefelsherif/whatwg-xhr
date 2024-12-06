import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	// no data
	makeTest("", null, 'json response with no data: response property is null');

	// malformed
	makeTest('{"test":"foo"', null, 'json response with malformed data: response property is null');

	// real object
	let obj = {alpha:'a-z', integer:15003, negated:-20, b1:true, b2:false, myAr:['a', 'b', 'c', 1, 2, 3]};

	makeTest(JSON.stringify(obj), obj,  'JSON object roundtrip');
	makeTest('{"日本語":"にほんご"}', {"日本語":"にほんご"}, 'JSON roundtrip with Japanese text');

	function makeTest(data, expectedResponse, description){

		let xhr = setupXHR();
		assert.strictEqual(xhr.responseType, 'json');

		xhr.onreadystatechange = () => {
			if(xhr.readyState === 4){
				assert.strictEqual(xhr.status, 200);
				assert.strictEqual(xhr.responseType, 'json');
				assert.strictEqual(typeof xhr.response, 'object');

				// if the expectedResponse is not null, we iterate over properties to do a deeper comparison..
				if(expectedResponse){
					for(let prop in expectedResponse){
						if(expectedResponse[prop] instanceof Array){
							assert.deepStrictEqual(expectedResponse[prop], xhr.response[prop]);
						}
						else{
							assert.strictEqual(expectedResponse[prop], xhr.response[prop]);
						}
					}
				}
				else{
					assert.strictEqual(xhr.response, expectedResponse); // null comparison, basically
				}
				assert.strictEqual(xhr.response, xhr.response, 'Response should be cached');
				xhr.onreadystatechange = null;
			}
		};

		xhr.send(data);
	}

	function setupXHR(){
		let xhr = new XMLHttpRequest();

		xhr.open('POST', `${activeURL}/content.py`, true);
		xhr.responseType = 'json';

		return xhr;
	}
}
﻿
/*
 * response-json.htm
 *

<!doctype html>
<html>
  <head>
    <title>XMLHttpRequest: responseType json</title>
    <meta charset="utf-8">
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
        <link rel="help" href="https://xhr.spec.whatwg.org/#the-responsetype-attribute" data-tested-assertations="following::OL[1]/LI[4]" />
        <link rel="help" href="https://xhr.spec.whatwg.org/#the-response-attribute" data-tested-assertations="following::dt[2]/dt[4] following::dt[2]/dt[4]/following::dd[1]" />
        <link rel="help" href="https://xhr.spec.whatwg.org/#json-response-entity-body" data-tested-assertations="following::ol[1]/li[1] following::ol[1]/li[2] following::ol[1]/li[3]" />

  </head>
  <body>
    <div id="log"></div>
    <script>
      function setupXHR () {
        var client = new XMLHttpRequest()
        client.open('POST', "resources/content.py", true)
        client.responseType = 'json'
        return client
      }
      function makeTest(data, expectedResponse, description){
        var test = async_test(description)
        var xhr = setupXHR()
        assert_equals(xhr.responseType, 'json')
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                test.step(function(){
                    assert_equals(xhr.status, 200)
                    assert_equals(xhr.responseType, 'json')
                    assert_equals(typeof xhr.response, 'object')
                    if(expectedResponse){ // if the expectedResponse is not null, we iterate over properties to do a deeper comparison..
                        for(var prop in expectedResponse){
                          if (expectedResponse[prop] instanceof Array) {
                            assert_array_equals(expectedResponse[prop], xhr.response[prop])
                          }else{
                            assert_equals(expectedResponse[prop], xhr.response[prop])
                          }
                        }
                    }else{
                        assert_equals(xhr.response, expectedResponse) // null comparison, basically
                    }
                    assert_equals(xhr.response, xhr.response,
                                  "Response should be cached")
                    test.done()
                })
            }
        }
        xhr.send(data)
      }
      // no data
      makeTest("", null, 'json response with no data: response property is null')
      // malformed
      makeTest('{"test":"foo"', null, 'json response with malformed data: response property is null')
      // real object
      var obj = {alpha:'a-z', integer:15003, negated:-20, b1:true, b2:false, myAr:['a', 'b', 'c', 1, 2, 3]}
      makeTest(JSON.stringify(obj), obj,  'JSON object roundtrip')
      makeTest('{"日本語":"にほんご"}', {"日本語":"にほんご"}, 'JSON roundtrip with Japanese text')
    </script>
  </body>
</html>

 *
 * response-json.htm
 */
