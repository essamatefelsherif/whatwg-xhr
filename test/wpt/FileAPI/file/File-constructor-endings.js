import assert from 'node:assert/strict';
import { EOL } from 'node:os';
import { File as FilePolyfill } from '../../../../lib/helper/file-polyfill.js';

globalThis.File = FilePolyfill;

export default (activeURL) => {

	[ 'transparent',  'native'].forEach(value => {
		assert_class_string(new File([], 'name', {endings: value}), 'File', `Constructor should allow "${value}" endings`);
	});

	[
		null,
		'',
		'invalidEnumValue',
		'Transparent',
		'NATIVE',
		0,
		{}
	].forEach(value => {
		assert.throws(
			() => {
				new File([], 'name', {endings: value});
			},
			(err) => {
				assert(err instanceof TypeError, `Invalid "endings" value: ${JSON.stringify(value)}`);
				return true;
			}
		);
	});

	(function test(){
		const test_error = {name: 'test'};

		assert.throws(
			() => {
				new File([], "name", { get endings() { throw test_error; }});
			},
			(err) => {
				assert.deepStrictEqual(err, test_error, 'File constructor should propagate exceptions from "endings" property');
				return true;
			}
		);
	})('Exception propagation from options');

	(function test(){
		let got = false;
		new File([], "name", { get endings() { got = true; } });

		assert(got, 'The "endings" property was accessed during construction.');
	})('The "endings" options property is used');

	[
		{name: 'LF', input: '\n', native: EOL},
		{name: 'CR', input: '\r', native: '\r'},

		{name: 'CRLF', input: '\r\n', native: EOL},
		{name: 'CRCR', input: '\r\r', native: '\r\r'},
		{name: 'LFCR', input: '\n\r', native: EOL + '\r'},
		{name: 'LFLF', input: '\n\n', native: EOL.repeat(2)},

		{name: 'CRCRLF', input: '\r\r\n', native: '\r' + EOL},
		{name: 'CRLFLF', input: '\r\n\n', native: EOL.repeat(2)},
		{name: 'CRLFCR', input: '\r\n\r\n', native: EOL.repeat(2)},

		{name: 'CRLFCRLF', input: '\r\n\r\n', native: EOL.repeat(2)},
		{name: 'LFCRLFCR', input: '\n\r\n\r', native: EOL.repeat(2) + '\r'},

	].forEach(testCase => {

		(async() => {
			const file = new File([testCase.input], 'name');
			assert.strictEqual(
				await readBlobAsPromise(file),
				testCase.input,
				'Newlines should not change with endings unspecified');
		})(`Input ${testCase.name} with endings unspecified`);

		(async() => {
			const file = new File([testCase.input], "name", {endings: 'transparent'});
			assert.strictEqual(
				await readBlobAsPromise(file),
				testCase.input,
				'Newlines should not change with endings "transparent"');
		})(`Input ${testCase.name} with endings 'transparent'`);


		(async() => {
			const file = new File([testCase.input], "name", {endings: 'native'});
			assert.strictEqual(
				await readBlobAsPromise(file),
				testCase.native,
				'Newlines should match the platform with endings "native');
		})(`Input ${testCase.name} with endings 'native'`);
	});

	(async function test(){
		const file = new File(['\r', '\n'], "name", {endings: 'native'});
		const expected = '\r' + EOL;

		assert.strictEqual(
			await readBlobAsPromise(file),
			expected,
			'CR/LF in adjacent strings should be converted to two platform newlines'
		);
	})(`CR/LF in adjacent input strings`);

	function assert_class_string(object, class_string, description){
		var actual = {}.toString.call(object);
		var expected = "[object " + class_string + "]";

		assert(same_value(actual, expected), description);
		function same_value(x, y){
			if(y !== y) {
				//NaN case
				return x !== x;
			}
			if (x === 0 && y === 0) {
				//Distinguish +0 and -0
				return 1/x === 1/y;
			}
			return x === y;
		}
	}

	function readBlobAsPromise(blob){
		return blob.text();
	}
}

/*
 * File-constructor-endings.html
 *

<!DOCTYPE html>
<meta charset=utf-8>
<title>File constructor: endings option</title>
<link rel=help href="https://w3c.github.io/FileAPI/#file-constructor">
<script src="/resources/testharness.js"></script>
<script src="/resources/testharnessreport.js"></script>
<script>

// Windows platforms use CRLF as the native line ending. All others use LF.
const crlf = navigator.platform.startsWith('Win');
const native_ending = crlf ? '\r\n' : '\n';

function readBlobAsPromise(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(blob);
    reader.onload = e => resolve(reader.result);
    reader.onerror = e => reject(reader.error);
  });
}

[
  'transparent',
  'native'
].forEach(value => test(t => {
  assert_class_string(new File([], "name", {endings: value}), 'File',
                      `Constructor should allow "${value}" endings`);
}, `Valid "endings" value: ${JSON.stringify(value)}`));

[
  null,
  '',
  'invalidEnumValue',
  'Transparent',
  'NATIVE',
  0,
  {}
].forEach(value => test(t => {
  assert_throws_js(TypeError, () => new File([], "name", {endings: value}),
                   'File constructor should throw');
}, `Invalid "endings" value: ${JSON.stringify(value)}`));

test(t => {
  const test_error = {name: 'test'};
  assert_throws_exactly(
    test_error,
    () => new File([], "name", { get endings() { throw test_error; }}),
    'File constructor should propagate exceptions from "endings" property');
}, 'Exception propagation from options');

test(t => {
  let got = false;
  new File([], "name", { get endings() { got = true; } });
  assert_true(got, 'The "endings" property was accessed during construction.');
}, 'The "endings" options property is used');

[
  {name: 'LF', input: '\n', native: native_ending},
  {name: 'CR', input: '\r', native: native_ending},

  {name: 'CRLF', input: '\r\n', native: native_ending},
  {name: 'CRCR', input: '\r\r', native: native_ending.repeat(2)},
  {name: 'LFCR', input: '\n\r', native: native_ending.repeat(2)},
  {name: 'LFLF', input: '\n\n', native: native_ending.repeat(2)},

  {name: 'CRCRLF', input: '\r\r\n', native: native_ending.repeat(2)},
  {name: 'CRLFLF', input: '\r\n\n', native: native_ending.repeat(2)},
  {name: 'CRLFCR', input: '\r\n\r\n', native: native_ending.repeat(2)},

  {name: 'CRLFCRLF', input: '\r\n\r\n', native: native_ending.repeat(2)},
  {name: 'LFCRLFCR', input: '\n\r\n\r', native: native_ending.repeat(3)},

].forEach(testCase => {
  promise_test(async t => {
    const file = new File([testCase.input], "name");
    assert_equals(
      await readBlobAsPromise(file), testCase.input,
      'Newlines should not change with endings unspecified');
  }, `Input ${testCase.name} with endings unspecified`);

  promise_test(async t => {
    const file = new File([testCase.input], "name", {endings: 'transparent'});
    assert_equals(
      await readBlobAsPromise(file), testCase.input,
      'Newlines should not change with endings "transparent"');
  }, `Input ${testCase.name} with endings 'transparent'`);

  promise_test(async t => {
    const file = new File([testCase.input], "name", {endings: 'native'});
    assert_equals(
      await readBlobAsPromise(file), testCase.native,
      'Newlines should match the platform with endings "native"');
  }, `Input ${testCase.name} with endings 'native'`);
});

promise_test(async t => {
  const file = new File(['\r', '\n'], "name", {endings: 'native'});
  const expected = native_ending.repeat(2);
  assert_equals(
    await readBlobAsPromise(file), expected,
    'CR/LF in adjacent strings should be converted to two platform newlines');
}, `CR/LF in adjacent input strings`);

</script>

 *
 *
 */
