import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let xhr = new XMLHttpRequest();

	xhr.open('POST', `${activeURL}/header-user-agent.py`, false);

	xhr.setRequestHeader('x-test', 'foobar');

	xhr.send();

	assert.strictEqual(xhr.responseText, 'PASS');
}
﻿
/*
 * header-user-agent-sync.htm
 *

<!DOCTYPE html>
<html>
<head>
    <title>Test that sync requests (both OPTIONS preflight and regular) are sent with the User-Agent header</title>
    <script src="/resources/testharness.js"></script>
    <script src="/resources/testharnessreport.js"></script>
    <script src="/common/get-host-info.sub.js"></script>
</head>
<body>
<script type="text/javascript">
  test(function() {
    let xhr = new XMLHttpRequest;
    xhr.open("post", get_host_info().HTTP_REMOTE_ORIGIN + "/xhr/resources/header-user-agent.py", false);
    xhr.setRequestHeader("x-test", "foobar");
    xhr.send();
    assert_equals(xhr.responseText, "PASS");
  }, "Sync request has User-Agent header");
</script>
</body>
</html>

 *
 * header-user-agent-sync.htm
 */
