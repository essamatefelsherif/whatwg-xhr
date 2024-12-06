import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	let lastTest = false;

	let log = [];
	let expected = [
		'readyState before abort() 1',
		'upload.onabort - before open() 4',
		'readyState after open() 1',

		'xhr.onabort 1',
		'xhr.onloadend 1',
		'readyState after abort() 1',

		'xhr.onload 4',
		'xhr.onloadend 4',
	];

	xhr.upload.onloadstart = () => {
		log.push('readyState before abort() ' + xhr.readyState);

		xhr.abort();
		log.push('readyState after abort() ' + xhr.readyState);
	};

	xhr.upload.onabort = () => {
		log.push('upload.onabort - before open() ' + xhr.readyState);

		xhr.open('GET', `${activeURL}/content.py`);
		log.push('readyState after open() ' + xhr.readyState);

		xhr.send();
	};

	xhr.onabort = () => {
		// happens immediately after all of upload.onabort, so readyState is 1
		log.push('xhr.onabort ' + xhr.readyState);
	};

	xhr.onload = () => {
		log.push('xhr.onload ' + xhr.readyState);
	};

	xhr.onloadend = () => {
		log.push('xhr.onloadend ' + xhr.readyState);

		if(lastTest){
			assert.deepStrictEqual(log, expected);
		}
		lastTest = true;
	};

	xhr.open('POST', `${activeURL}/content.py`);
	xhr.send('non-empty');
}
﻿
/*
 * open-during-abort-event.htm
 *

<!doctype html>
<title>XMLHttpRequest: open() during abort event - abort() called from upload.onloadstart</title>
<script src="/resources/testharness.js"></script>
<script src="/resources/testharnessreport.js"></script>
<div id="log"></div>
<script>
async_test(t => {
  let client = new XMLHttpRequest(),
      log = [],
      lastTest = false,
      expected = [
        'readyState before abort() 1',
        "upload.onabort - before open() 4",
        "readyState after open() 1",
        "client.onabort 1",
        "client.onloadend 1",
        "readyState after abort() 1",
        "client.onload 4",
        "client.onloadend 4"
      ]

  client.upload.onloadstart = t.step_func(() => {
    log.push('readyState before abort() '+client.readyState)
    client.abort()
    log.push('readyState after abort() '+client.readyState)
  })

  client.upload.onabort = t.step_func(() => {
    log.push('upload.onabort - before open() ' + client.readyState)
    client.open("GET", "resources/content.py")
    log.push('readyState after open() ' + client.readyState)
    client.send(null)
  })

  client.onabort = t.step_func(() => {
    // happens immediately after all of upload.onabort, so readyState is 1
    log.push('client.onabort ' + client.readyState)
  })

  client.onloadend = t.step_func(() => {
    log.push('client.onloadend ' + client.readyState)
    if(lastTest) {
      assert_array_equals(log, expected)
      t.done()
    }
    lastTest = true
  })

  client.onload = t.step_func(() => {
    log.push('client.onload ' + client.readyState)
  })

  client.open("POST", "resources/content.py")
  client.send("non-empty")
})
</script>

 *
 * open-during-abort-event.htm
 */
