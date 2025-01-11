import assert from 'node:assert/strict';
import { FormData } from '../../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	assert.strictEqual(create_formdata(['key', 'value1'], ['key', 'value2']).has('key'), true);
	assert.strictEqual(create_formdata(['key', 'value1'], ['key', 'value2']).has('nil'), false);
	assert.strictEqual(create_formdata().has('key'), false);

	function create_formdata() {
		const fd = new FormData();

		for(let i = 0; i < arguments.length; i++){
			fd.append.apply(fd, arguments[i]);
		};

		return fd;
	}
}
﻿
/*
 * has.any.js
 *

// META: title=FormData: has

    test(function() {
        assert_equals(create_formdata(['key', 'value1'], ['key', 'value2']).has('key'), true);
    }, 'testFormDataHas');
    test(function() {
        assert_equals(create_formdata(['key', 'value1'], ['key', 'value2']).has('nil'), false);
    }, 'testFormDataHasEmpty1');
    test(function() {
        assert_equals(create_formdata().has('key'), false);
    }, 'testFormDataHasEmpty2');

    function create_formdata() {
        var fd = new FormData();
        for (var i = 0; i < arguments.length; i++) {
            fd.append.apply(fd, arguments[i]);
        };
        return fd;
    }

 *
 *
 */
