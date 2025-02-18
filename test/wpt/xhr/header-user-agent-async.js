import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	xhr.open('GET', `${activeURL}/header-user-agent.py`);

	xhr.setRequestHeader('x-test', 'foobar');

	xhr.onerror = () => {
		assert(false, 'Unexpected error');
	};

	xhr.onload = () => {
		assert.strictEqual(xhr.responseText, 'PASS');
	};

	xhr.send();
}
﻿
/*
 * header-user-agent-async.htm
 *

<!DOCTYPE html>
<html>
<head>
    <title>Test that async requests (both OPTIONS preflight and regular) are sent with the User-Agent header</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <script src="/common/get-host-info.sub.js"></script>
</head>
<body>
<script type="text/javascript">
  async_test((test) => {
    let xhr = new XMLHttpRequest;
    xhr.open("GET", get_host_info().HTTP_REMOTE_ORIGIN + "/xhr/resources/header-user-agent.py");
    xhr.setRequestHeader("x-test", "foobar");

    xhr.onerror = test.unreached_func("Unexpected error");

    xhr.onload = test.step_func_done(() => {
      assert_equals(xhr.responseText, "PASS");
    });

    xhr.send();
  }, "Async request has User-Agent header");
</script>
</body>
</html>

 *
 * header-user-agent-async.htm
 */
