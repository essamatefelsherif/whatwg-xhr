import assert from 'node:assert/strict';
import { XMLHttpRequest } from '../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	let log = [];
	let expected = [
		'method',
		'url',
		// NOTE: 'async' intentionally missing
		'username',
		'password',
	];

	let xhr = new XMLHttpRequest();
	xhr.open(
		{
			toString(){
				log.push('method');
				return 'get';
			},
		},
		{
			toString(){
				log.push('url');
				return activeURL;
			},
		},
		// NOTE: ToBoolean should not invoke valueOf
		{
			valueOf() {
				log.push('async');
				return true;
			},
		},
		{
			toString() {
				log.push('username');
				return 'username';
			},
		},
		{
			toString() {
				log.push('password');
				return 'password';
			},
		}
	);

	assert.deepStrictEqual(log, expected);
}
﻿
/*
 * open-parameters-toString.htm
 *

<!doctype html>
<title>XMLHttpRequest: open() attempts to toString its string parameters</title>
<script src="/resources/testharness.js"></script>
<script src="/resources/testharnessreport.js"></script>
<div id="log"></div>
<script>
test(() => {
  let log = [];
  let expected = [
    'method',
    'url',
    // NOTE: 'async' intentionally missing
    'username',
    'password',
  ];

  let xhr = new XMLHttpRequest;
  xhr.open(
    {
      toString() {
        log.push('method');
        return 'get';
      },
    },
    {
      toString() {
        log.push('url');
        return location.href;
      },
    },
    // NOTE: ToBoolean should not invoke valueOf
    {
      valueOf() {
        log.push('async');
        return true;
      },
    },
    {
      toString() {
        log.push('username');
        return 'username';
      },
    },
    {
      toString() {
        log.push('password');
        return 'password';
      },
    }
  );

  assert_array_equals(log, expected);
});
</script>

 *
 * open-parameters-toString.htm
 */
