import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	let test_state = 1;

	let log = [];
	let expected = [
		'onloadstart readyState before abort() 1',
		'onreadystatechange readyState before open() 4',
		'onreadystatechange readyState after open() 1',
		'onloadstart readyState 1',
		'xhr.onabort 1',
		'readyState after abort() 1',
		'xhr.onload 4'
	];

	xhr.onreadystatechange = () => {
		if(test_state === 2){
			test_state = 3;

			log.push('onreadystatechange readyState before open() ' + xhr.readyState);
			xhr.open('GET', `${activeURL}/content.py`);
			log.push('onreadystatechange readyState after open() ' + xhr.readyState);
			xhr.send();
		}
	};

	xhr.onloadstart = () => {
		if(test_state === 1){
			test_state = 2;

			log.push('onloadstart readyState before abort() ' + xhr.readyState);
			xhr.abort();
			log.push('readyState after abort() ' + xhr.readyState);
		}
		else{
			log.push('onloadstart readyState ' + xhr.readyState);
		}
	};

	xhr.upload.onabort = () => {
		log.push('upload.onabort ' + xhr.readyState);
	};

	xhr.onabort = () => {
		log.push('xhr.onabort ' + xhr.readyState);
	};

	xhr.upload.onloadend = () => {
		log.push('upload.onloadend ' + xhr.readyState);
	};

	xhr.onload = () => {
		log.push('xhr.onload ' + xhr.readyState);

		assert.deepStrictEqual(log, expected);
	};

	xhr.open('POST', `${activeURL}/content.py`);
	xhr.send('abcd');
}
﻿
/*
 * open-during-abort-processing.htm
 *

<!doctype html>
<title>XMLHttpRequest: open() during abort processing - abort() called from onloadstart</title>
<script src="/resources/testharness.js"></script>
<script src="/resources/testharnessreport.js"></script>
<div id="log"></div>
<script>
async_test(t => {
  let client = new XMLHttpRequest(),
      test_state = 1,
      log = [],
      expected = [
        "onloadstart readyState before abort() 1",
        "onreadystatechange readyState before open() 4",
        "onreadystatechange readyState after open() 1",
        "onloadstart readyState 1",
        "client.onabort 1",
        "readyState after abort() 1",
        "client.onload 4"
      ]

  client.onreadystatechange = t.step_func(() => {
    if(test_state === 2){
      test_state = 3
      log.push('onreadystatechange readyState before open() ' + client.readyState)
      client.open("GET", "resources/content.py")
      log.push('onreadystatechange readyState after open() ' + client.readyState)
      client.send(null)
    }
  })

  client.onloadstart = t.step_func(() => {
    if(test_state === 1){
      test_state = 2
      log.push('onloadstart readyState before abort() ' + client.readyState)
      client.abort()
      log.push('readyState after abort() ' + client.readyState)
    }else{
      log.push('onloadstart readyState ' + client.readyState)
    }
  })

  client.upload.onabort = t.step_func(() => {
    log.push('upload.onabort ' + client.readyState)
  })

  client.onabort = t.step_func(() => {
    log.push('client.onabort ' + client.readyState)
  })

  client.upload.onloadend = t.step_func(() => {
    log.push('upload.onloadend ' + client.readyState)
  })

  client.onload = t.step_func_done(() => {
    log.push('client.onload ' + client.readyState)
    assert_array_equals(log, expected)
  })

  client.open("POST", "resources/content.py")
  client.send('abcd')
})
</script>

 *
 * open-during-abort-processing.htm
 */
