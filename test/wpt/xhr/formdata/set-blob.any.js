import assert from 'node:assert/strict';
import { FormData } from '../../../../lib/whatwg-xhr.js';

export default (activeURL) => {

	const formData = new FormData();

	(() => {
		const value = new Blob();
		formData.set("blob-1", value);

		const blob1 = formData.get("blob-1");

		assert.notStrictEqual(blob1, value);

		assert.strictEqual(blob1.constructor.name, "File");
		assert.strictEqual(blob1.name, "blob");
		assert.strictEqual(blob1.type, "");
		assert.strictEqual(formData.get("blob-1") === formData.get("blob-1"), true, "should return the same value when get the same blob entry from FormData");

		assert(Math.abs(blob1.lastModified - Date.now()) < 200, "lastModified should be now");
	})( "blob without type");

	(() => {
		const value = new Blob([], { type: "text/plain" });
		formData.set("blob-2", value);

		const blob2 = formData.get("blob-2");

		assert.notStrictEqual(blob2, value);

		assert.strictEqual(blob2.constructor.name, "File");
		assert.strictEqual(blob2.name, "blob");
		assert.strictEqual(blob2.type, "text/plain");

		assert(Math.abs(blob2.lastModified - Date.now()) < 200, "lastModified should be now");
	})( "blob with type");

	(() => {
		const value = new Blob();
		formData.set("blob-3", value, "custom name");

		const blob3 = formData.get("blob-3");

		assert.notStrictEqual(blob3, value);

		assert.strictEqual(blob3.constructor.name, "File");
		assert.strictEqual(blob3.name, "custom name");
		assert.strictEqual(blob3.type, "");

		assert(Math.abs(blob3.lastModified - Date.now()) < 200, "lastModified should be now");
	})( "blob with custom name");

	(() => {
		const value = new File([], "name");
		formData.set("file-1", value);

		const file1 = formData.get("file-1");

		assert.strictEqual(file1, value);
		assert.strictEqual(file1.constructor.name, "File");
		assert.strictEqual(file1.name, "name");
		assert.strictEqual(file1.type, "");

		assert(Math.abs(file1.lastModified - Date.now()) < 200, "lastModified should be now");
	})( "file without lastModified or custom name");

	(() => {
		const value = new File([], "name", { lastModified: 123 });
		formData.set("file-2", value, "custom name");

		const file2 = formData.get("file-2");

		assert.notStrictEqual(file2, value);

		assert.strictEqual(file2.constructor.name, "File");
		assert.strictEqual(file2.name, "custom name");
		assert.strictEqual(file2.type, "");
		assert.strictEqual(file2.lastModified, 123, "lastModified should be 123");
	})( "file with lastModified and custom name");

}
﻿
/*
 * set-blob.any.js
 *

// META: title=formData.set(blob) and formData.set(file)

"use strict";

const formData = new FormData();

test(() => {
  const value = new Blob();
  formData.set("blob-1", value);
  const blob1 = formData.get("blob-1");
  assert_not_equals(blob1, value);
  assert_equals(blob1.constructor.name, "File");
  assert_equals(blob1.name, "blob");
  assert_equals(blob1.type, "");
  assert_equals(formData.get("blob-1") === formData.get("blob-1"), true, "should return the same value when get the same blob entry from FormData");
  assert_less_than(Math.abs(blob1.lastModified - Date.now()), 200, "lastModified should be now");
}, "blob without type");

test(() => {
  const value = new Blob([], { type: "text/plain" });
  formData.set("blob-2", value);
  const blob2 = formData.get("blob-2");
  assert_not_equals(blob2, value);
  assert_equals(blob2.constructor.name, "File");
  assert_equals(blob2.name, "blob");
  assert_equals(blob2.type, "text/plain");
  assert_less_than(Math.abs(blob2.lastModified - Date.now()), 200, "lastModified should be now");
}, "blob with type");

test(() => {
  const value = new Blob();
  formData.set("blob-3", value, "custom name");
  const blob3 = formData.get("blob-3");
  assert_not_equals(blob3, value);
  assert_equals(blob3.constructor.name, "File");
  assert_equals(blob3.name, "custom name");
  assert_equals(blob3.type, "");
  assert_less_than(Math.abs(blob3.lastModified - Date.now()), 200, "lastModified should be now");
}, "blob with custom name");

test(() => {
  const value = new File([], "name");
  formData.set("file-1", value);
  const file1 = formData.get("file-1");
  assert_equals(file1, value);
  assert_equals(file1.constructor.name, "File");
  assert_equals(file1.name, "name");
  assert_equals(file1.type, "");
  assert_less_than(Math.abs(file1.lastModified - Date.now()), 200, "lastModified should be now");
}, "file without lastModified or custom name");

test(() => {
  const value = new File([], "name", { lastModified: 123 });
  formData.set("file-2", value, "custom name");
  const file2 = formData.get("file-2");
  assert_not_equals(file2, value);
  assert_equals(file2.constructor.name, "File");
  assert_equals(file2.name, "custom name");
  assert_equals(file2.type, "");
  assert_equals(file2.lastModified, 123, "lastModified should be 123");
}, "file with lastModified and custom name");

 *
 *
 */
