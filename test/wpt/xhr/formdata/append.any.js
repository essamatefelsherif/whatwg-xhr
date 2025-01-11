import assert from 'node:assert/strict';
import { FormData } from '../../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	assert.strictEqual(create_formdata(['key', 'value1']).get('key'), 'value1');
	assert.strictEqual(create_formdata(['key', 'value2'], ['key', 'value1']).get('key'), 'value2');
	assert.strictEqual(create_formdata(['key', undefined]).get('key'), 'undefined');
	assert.strictEqual(create_formdata(['key', undefined], ['key', 'value1']).get('key'), 'undefined');
	assert.strictEqual(create_formdata(['key', null]).get('key'), 'null');
	assert.strictEqual(create_formdata(['key', null], ['key', 'value1']).get('key'), 'null');

	let before = new Date(new Date().getTime() - 2000); // two seconds ago, in case there's clock drift
	let fd = create_formdata(['key', new Blob(), 'blank.txt']).get('key');

	assert.strictEqual(fd.name, "blank.txt");
	assert.strictEqual(fd.type, "");
	assert.strictEqual(fd.size, 0);

	assert(fd.lastModified >= before);
	assert(fd.lastModified <= new Date());

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
 * append.any.js
 *

// META: title=FormData.append

    test(function() {
        assert_equals(create_formdata(['key', 'value1']).get('key'), "value1");
    }, 'testFormDataAppend1');
    test(function() {
        assert_equals(create_formdata(['key', 'value2'], ['key', 'value1']).get('key'), "value2");
    }, 'testFormDataAppend2');
    test(function() {
        assert_equals(create_formdata(['key', undefined]).get('key'), "undefined");
    }, 'testFormDataAppendUndefined1');
    test(function() {
        assert_equals(create_formdata(['key', undefined], ['key', 'value1']).get('key'), "undefined");
    }, 'testFormDataAppendUndefined2');
    test(function() {
        assert_equals(create_formdata(['key', null]).get('key'), "null");
    }, 'testFormDataAppendNull1');
    test(function() {
        assert_equals(create_formdata(['key', null], ['key', 'value1']).get('key'), "null");
    }, 'testFormDataAppendNull2');
    test(function() {
        var before = new Date(new Date().getTime() - 2000); // two seconds ago, in case there's clock drift
        var fd = create_formdata(['key', new Blob(), 'blank.txt']).get('key');
        assert_equals(fd.name, "blank.txt");
        assert_equals(fd.type, "");
        assert_equals(fd.size, 0);
        assert_greater_than_equal(fd.lastModified, before);
        assert_less_than_equal(fd.lastModified, new Date());
    }, 'testFormDataAppendEmptyBlob');

    function create_formdata() {
        var fd = new FormData();
        for (var i = 0; i < arguments.length; i++) {
            fd.append.apply(fd, arguments[i]);
        };
        return fd;
    }

 *
 * append.any.js
 */
