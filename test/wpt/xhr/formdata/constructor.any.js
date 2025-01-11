import assert from 'node:assert/strict';
import { FormData } from '../../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	assert.throws(
		() => {
			new FormData(null);
		},
		(err) => {
			assert(err instanceof TypeError, 'TypeError expected');
			return true;
		}
	);

	assert.throws(
		() => {
			new FormData('string');
		},
		(err) => {
			assert(err instanceof TypeError, 'TypeError expected');
			return true;
		}
	);
}
﻿
/*
 * constructor.any.js
 *

// META: title=FormData: constructor

test(() => {
  assert_throws_js(TypeError, () => { new FormData(null); });
  assert_throws_js(TypeError, () => { new FormData("string"); });
}, "Constructors should throw a type error");

 *
 *
 */
