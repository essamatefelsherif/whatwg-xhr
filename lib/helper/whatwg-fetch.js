/**
 * Fetch Living Standard — Last Updated 7 June 2023
 * url: https://fetch.spec.whatwg.org/#forbidden-request-header
 *
 * @module  whatwg-fetch
 * @desc    Helper module - Helper functions for the main module {@link module:whatwg-xhr whatwg-xhr}.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/* Import nodeJS core modules */
import assert               from 'node:assert';
import { Blob }             from 'node:buffer';
import { Readable, Duplex } from 'node:stream';
import { TextEncoder }      from 'node:util';
import { URLSearchParams }  from 'node:url';

/* Import from whatwg-xhr main module */
import { FormData }           from '../whatwg-xhr.js';
import { disableHeaderCheck } from '../whatwg-xhr.js';

/**
 * @const {Set} forbiddenRequestHeaderName
 * @desc  Set of forbidden request-headers, as defined by {@link https://fetch.spec.whatwg.org/#forbidden-request-header WHATWG Fetch Living Standard}.
 */
const forbiddenRequestHeaderName = new Set([
	'accept-charset',
	'accept-encoding',
	'access-control-request-headers',
	'access-control-request-method',
	'connection',
	'content-length',
	'cookie',
	'cookie2',
	'date',
	'dnt',
	'expect',
	'host',
	'keep-alive',
	'origin',
	'referer',
	'set-cookie',
	'te',
	'trailer',
	'transfer-encoding',
	'upgrade',
	'via'
]);

/**
 * Fetch Living Standard — Last Updated 7 June 2023
 * url: https://fetch.spec.whatwg.org/#forbidden-request-header
 *
 * A header (name, value) is forbidden request-header if these steps return true:
 *     1. If name is a byte-case-insensitive match for one of:
 *         `Accept-Charset`
 *         `Accept-Encoding`
 *         `Access-Control-Request-Headers`
 *         `Access-Control-Request-Method`
 *         `Connection`
 *         `Content-Length`
 *         `Cookie`
 *         `Cookie2`
 *         `Date`
 *         `DNT`
 *         `Expect`
 *         `Host`
 *         `Keep-Alive`
 *         `Origin`
 *         `Referer`
 *         `Set-Cookie`
 *         `TE`
 *         `Trailer`
 *         `Transfer-Encoding`
 *         `Upgrade`
 *         `Via`
 *     then return true.
 *
 *     2. If name when byte-lowercased starts with `proxy-` or `sec-`, then return true.
 *
 *     3. If name is a byte-case-insensitive match for one of:
 *         `X-HTTP-Method`
 *         `X-HTTP-Method-Override`
 *         `X-Method-Override`
 *     then:
 *         1. Let parsedValues be the result of getting, decoding, and splitting value.
 *         2. For each method of parsedValues: if the isomorphic encoding of method is
 *            a forbidden method, then return true.
 *
 *     4. Return false.
 *
 *     Note: These are forbidden so the user agent remains in full control over them.
 *     Header names starting with `Sec-` are reserved to allow new headers to be minted
 *     that are safe from APIs using fetch that allow control over headers by developers,
 *     such as XMLHttpRequest. [XHR]
 *     The `Set-Cookie` header is semantically a response header, so it is not useful on
 *     requests. Because `Set-Cookie` headers cannot be combined, they require more complex
 *     handling in the Headers object. It is forbidden here to avoid leaking this complexity
 *     into requests.
 *
 * @func     forbiddenRequestHeader
 * @static
 * @param    {string}  name  - The name of the Http request header.
 * @param    {string}  value - The value of the Http request header.
 * @return   {boolean} true if the Http request header is forbidden, otherwise false.
 * @desc     To determine if the Http request header given by name and value is forbidden by {@link https://fetch.spec.whatwg.org/#forbidden-request-header WHATWG Fetch Living Standard}.
 * @requires module:whatwg-xhr.disableHeaderCheck
 */
export function forbiddenRequestHeader(name, value){

	if(disableHeaderCheck)
		return false;

	// fetch.spec.1. If name is a byte-case-insensitive match for one of the forbiddenRequestHeaderName set, then return true.
	if(!name || forbiddenRequestHeaderName.has(name.toLowerCase()))
		return true;

	// fetch.spec.2. If name when byte-lowercased starts with `proxy-` or `sec-`, then return true.
	if(name.toLowerCase().startsWith('proxy-') || name.toLowerCase().startsWith('sec-'))
		return true;

	// fetch.spec.3. If name is a byte-case-insensitive match for one of: `X-HTTP-Method`, `X-HTTP-Method-Override`, `X-Method-Override`
	if(['x-http-method', 'x-http-method-override', 'x-method-override'].includes(name.toLowerCase())){

		// fetch.spec.3.1. Let parsedValues be the result of getting, decoding, and splitting value.
		const parsedValues = value.split(',').map(e => e.trim());

		// fetch.spec.3.2. For each method of parsedValues: if the isomorphic encoding of method is a forbidden method, then return true.
		for(let method of parsedValues)
			if(forbiddenRequestHeaderName.has(method.toLowerCase()))
				return true;
	}
	return false;
};

/**
 * Fetch Living Standard — Last Updated 6 March 2023
 * url: https://fetch.spec.whatwg.org/#methods
 *
 * A method is a byte sequence that matches the method token production.
 * A CORS-safelisted method is a method that is `GET`, `HEAD`, or `POST`.
 * A forbidden method is a method that is a byte-case-insensitive match for `CONNECT`, `TRACE`, or `TRACK`.
 *
 * To normalize a method, if it is a byte-case-insensitive match for `DELETE`, `GET`, `HEAD`, `OPTIONS`, `POST`, or `PUT`, byte-uppercase it.
 *
 * Normalization is done for backwards compatibility and consistency across APIs as methods are actually "case-sensitive".
 * Using `patch` is highly likely to result in a `405 Method Not Allowed`. `PATCH` is much more likely to succeed.
 * There are no restrictions on methods. `CHICKEN` is perfectly acceptable (and not a misspelling of `CHECKIN`). Other than those that are normalized
 * there are no casing restrictions either. `Egg` or `eGg` would be fine, though uppercase is encouraged for consistency.
 *
 * @const {Set} corsSafelistedHttpRequestMethod
 * @static
 * @desc   A CORS-safelisted method is a method that is `GET`, `HEAD`, or `POST`, as defined by {@link https://fetch.spec.whatwg.org/#methods WHATWG Fetch Living Standard}.
 */
export const corsSafelistedHttpRequestMethod = new Set(['get', 'head', 'post']);

/**
 * @const {Set} forbiddenHttpRequestMethod
 * @static
 * @desc   A forbidden method is a method that is a byte-case-insensitive match for `CONNECT`, `TRACE`, or `TRACK`, as defined by {@link https://fetch.spec.whatwg.org/#methods WHATWG Fetch Living Standard}..
 */
export const forbiddenHttpRequestMethod = new Set(['connect', 'trace', 'track']);

/* node:coverage disable ***/

/**
 * Fetch Living Standard — Last Updated 7 June 2023
 * url: https://fetch.spec.whatwg.org/#bodyinit-unions
 *
 * BodyInit unions
 *   typedef (Blob or BufferSource or FormData or URLSearchParams or USVString) XMLHttpRequestBodyInit;
 *   typedef (ReadableStream or XMLHttpRequestBodyInit) BodyInit;
 *
 * @func      isXMLHttpRequestBodyInit
 * @param     {Blob|ArrayBuffer|Uint8Array|DataView|FormData|URLSearchParams|string} body - The request body.
 * @return    {boolean} true if the typeof request body is one of the above types, otherwise false.
 * @desc      To determine the typeof request body, as defined by {@link https://fetch.spec.whatwg.org/#bodyinit-unions WHATWG Fetch Living Standard}.
 * @requires  module:whatwg-xhr.FormData
 */
function isXMLHttpRequestBodyInit(body){

	return body instanceof Blob            ||

	       body instanceof ArrayBuffer     ||
	       body instanceof Uint8Array      ||
	       body instanceof DataView        ||

	       body instanceof FormData        ||
	       body instanceof URLSearchParams ||

	       typeof body === 'string';
}

/**
 * @func     isXMLHttpRequestBodyInit
 * @param    {Blob|ArrayBuffer|Uint8Array|DataView|FormData|URLSearchParams|string|ReadableStream} body - The request body.
 * @return   {boolean} true if the typeof request body is one of the above types, otherwise false.
 * @desc     To determine the typeof request body, as defined by {@link https://fetch.spec.whatwg.org/#bodyinit-unions WHATWG Fetch Living Standard}.
 */
function isBodyInit(body){

	return body instanceof Readable ||
	       isXMLHttpRequestBodyInit(body);
}

/* node:coverage enable ***/

/**
 * Fetch Living Standard — Last Updated 7 June 2023
 * url: https://fetch.spec.whatwg.org/#bodyinit-safely-extract
 *
 * To safely extract a body with type from a byte sequence or BodyInit object object,
 * run these steps:
 *   1. If object is a ReadableStream object, then:
 *      1. Assert: object is neither disturbed nor locked.
 *   2. Return the result of extracting object.
 * Note: The safely extract operation is a subset of the extract operation that is
 * guaranteed to not throw an exception.
 *
 * To extract a body with type from a byte sequence or BodyInit object object, with an
 * optional boolean keepalive (default false), run these steps:
 *   1. Let stream be null.
 *   2. If object is a ReadableStream object, then set stream to object.
 *   3. Otherwise, if object is a Blob object, set stream to the result of running
 *      object’s get stream.
 *   4. Otherwise, set stream to a new ReadableStream object, and set up stream with
 *      byte reading support.
 *   5. Assert: stream is a ReadableStream object.
 *   6. Let action be null.
 *   7. Let source be null.
 *   8. Let length be null.
 *   9. Let type be null.
 *  10. Switch on object:
 *        Blob
 *          Set source to object.
 *          Set length to object’s size.
 *          If object’s type attribute is not the empty byte sequence, set type to its value.
 *        byte sequence
 *          Set source to object.
 *        BufferSource
 *          Set source to a copy of the bytes held by object.
 *        FormData
 *          Set action to this step: run the multipart/form-data encoding algorithm, with object’s
 *          entry list and UTF-8.
 *          Set source to object.
 *          Set length to unclear, see html/6424 for improving this.
 *          Set type to `multipart/form-data; boundary=`, followed by the multipart/form-data
 *          boundary string generated by the multipart/form-data encoding algorithm.
 *        URLSearchParams
 *          Set source to the result of running the application/x-www-form-urlencoded serializer
 *          with object’s list.
 *          Set type to `application/x-www-form-urlencoded;charset=UTF-8`.
 *        scalar value string
 *          Set source to the UTF-8 encoding of object.
 *          Set type to `text/plain;charset=UTF-8`.
 *        ReadableStream
 *          If keepalive is true, then throw a TypeError.
 *          If object is disturbed or locked, then throw a TypeError.
 *  11. If source is a byte sequence, then set action to a step that returns source and
 *      length to source’s length.
 *  12. If action is non-null, then run these steps in parallel:
 *          1. Run action.
 *             Whenever one or more bytes are available and stream is not errored,
 *             enqueue a Uint8Array wrapping an ArrayBuffer containing
 *             the available bytes into stream.
 *             When running action is done, close stream.
 *  13. Let body be a body whose stream is stream, source is source, and length is length.
 *  14. Return (body, type).
 *
 * @func     safelyExtractBodyWithType
 * @static
 * @param    {Blob|ArrayBuffer|Uint8Array|DataView|FormData|URLSearchParams|string|ReadableStream} body - The request body.
 * @param    {boolean} keepAlive - (Optional).
 * @return   {object}  Request body with type.
 * @desc     To return the request body with type, as defined by {@link https://fetch.spec.whatwg.org/#bodyinit-safely-extract WHATWG Fetch Living Standard}.
 * @requires module:whatwg-xhr.FormData
 */
export function safelyExtractBodyWithType(body, keepAlive = false){

	// fetch.spec.1. Let stream be null.
	let stream = null;

	/* node:coverage disable ***/
	// fetch.spec.2. If object is a ReadableStream object, then set stream to object.
	if(body instanceof Readable){
		stream = body;
	}
	/* node:coverage enable ***/
	else
	// fetch.spec.3. Otherwise, if object is a Blob object, set stream to the result
	//               of running object’s get stream.
	if(body instanceof Blob){
		stream = Duplex.from(body);
	}
	else{
	// fetch.spec.4. Otherwise, set stream to a new ReadableStream object, and set up
	//               stream with byte reading support.
		stream = new Readable({
			read(){},
			objectMode: false,
		});
	}
	// fetch.spec.5. Assert: stream is a ReadableStream object.
	{
		assert(stream.readable);
	}

	// fetch.spec.6. Let action be null.
	// fetch.spec.7. Let source be null.
	// fetch.spec.8. Let length be null.
	// fetch.spec.9. Let type be null.
	let action = null, source = null, length = null, type = null;

	// @author ...
	let blobs = null;

	// fetch.spec.10. Switch on object: Blob, byte sequence, BufferSource, FormData,
	//                URLSearchParams, scalar value string, ReadableStream

	// fetch.spec.10. Switch on object: Blob
	if(body instanceof Blob){
		// stream: NOT null, action: null, source: null, length: null, type: null

		// fetch.spec.10. Blob: Set source to object.
		source = body;

		// fetch.spec.10. Blob: Set length to object’s size.
		length = body.size;

		// fetch.spec.10. Blob: If object’s type attribute is not the empty byte sequence,
		//                      set type to its value.
		type = body.type ? body.type : type;

		// stream: NOT null, action: null, source: NOT null, length: NOT null, type: <depends>
	}
	else
	// fetch.spec.10. Switch on object: BufferSource
	if(
	    body instanceof ArrayBuffer       ||

	    body instanceof Uint8Array        ||
	    body instanceof Uint16Array       ||
	    body instanceof Uint32Array       ||
	    body instanceof Uint8ClampedArray ||
	    body instanceof Int8Array         ||
	    body instanceof Int16Array        ||
	    body instanceof Int32Array        ||
	    body instanceof Float32Array      ||
	    body instanceof Float64Array      ||
	    body instanceof DataView          ||

		body instanceof Buffer
	){
		// fetch.spec.10. Set source to a copy of the bytes held by object.
		if(body instanceof Buffer)
			source = Buffer.from(body);
		else
		if(body instanceof ArrayBuffer)
			source = Buffer.from(Buffer.from(body));
		else
			source = Buffer.copyBytesFrom(body);
		// stream: NOT null, action: null, source: NOT null, length: null, type: null

		// @revise
		length = source.length;
	}
	else
	// fetch.spec.10. Switch on object: FormData
	if(isFormDataLike(body)){

		const boundary = `----formdata-whatwg-xhr-${Math.random()}`.replace('.', '').slice(0, 32);
		const prefix = `--${boundary}\r\nContent-Disposition: form-data`;

		/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
		const escape = (str) => {
			return str.replace(/\n/g, '%0A').replace(/\r/g, '%0D').replace(/"/g, '%22');
		}

		const normalizeLinefeeds = (value) => {
			return value.replace(/\r?\n|\r/g, '\r\n');
		}

		const enc = new TextEncoder();
		const blobParts = [];
		const rn = new Uint8Array([13, 10]);

		length = 0;

		for(const [name, value] of body){
			if(typeof value === 'string'){
				const chunk = enc.encode(
					`${prefix}; name="${escape(normalizeLinefeeds(name))}"` +
					`\r\n\r\n${normalizeLinefeeds(value)}\r\n`
				);

				blobParts.push(chunk);
				length += chunk.byteLength;
			}
			else{
				const chunk = enc.encode(
					`${prefix}; name="${escape(normalizeLinefeeds(name))}"` +
					(value.name ? `; filename="${escape(value.name)}"` : '') + '\r\n' +
					`Content-Type: ${value.type || 'application/octet-stream'}\r\n\r\n`);

				blobParts.push(chunk, value, rn);
				length += chunk.byteLength + value.size + rn.byteLength;
			}
		}

		const chunk = enc.encode(`--${boundary}--`);
		blobParts.push(chunk);
		length += chunk.byteLength;

		blobs = blobParts;

		// fetch.spec.10. FormData: Set source to object.
		source = body;

		// fetch.spec.10. FormData: Set action to this step:
		//                run the multipart/form-data encoding algorithm,
		//                with object’s entry list and UTF-8.
		action = async function *(){
			for(const part of blobParts){
				if(part instanceof Blob){
					yield await part.bytes();
				}
				else{
					yield part;
				}
			}
		};

		// fetch.spec.10. FormData: Set type to `multipart/form-data; boundary=`,
		//                followed by the multipart/form-data boundary string
		//                generated by the multipart/form-data encoding algorithm.
		type = 'multipart/form-data; boundary=' + boundary;

		// stream: NOT null, action: NOT null, source: NOT null, length: NOT null, type: NOT null
	}
	else
	// fetch.spec.10. Switch on object: URLSearchParams
	if(body instanceof URLSearchParams){
		// fetch.spec.10. Set source to the result of running the application/x-www-form-urlencoded serializer with object’s list.
		source = body.toString();

		// fetch.spec.10. Set type to `application/x-www-form-urlencoded;charset=UTF-8`.
		type = 'application/x-www-form-urlencoded;charset=UTF-8';
		// stream: NOT null, action: null, source: NOT null, length: null, type: NOT null

		// @revise
		length = source.length;
	}
	else
	// fetch.spec.10. Switch on object: ReadableStream
	if(body instanceof Readable){
		// fetch.spec.10. If keepalive is true, then throw a TypeError.
		// fetch.spec.10. If object is disturbed or locked, then throw a TypeError.
		// @todo...
	}
	else{
		// fetch.spec.10. Switch on object: scalar value string
		body = String(body);

		// fetch.spec.10. Set source to the UTF-8 encoding of object.
		source = new TextEncoder().encode(body);

		// fetch.spec.10. Set type to `text/plain;charset=UTF-8`.
		type = 'text/plain;charset=UTF-8';

		// stream: NOT null, action: null, source: NOT null, length: null, type: NOT null

		// @revise
		length = source.length;
	}

	// fetch.spec.11. If source is a byte sequence, then set action to a step
	//                that returns source and length to source’s length.
		// @todo...

	// fetch.spec.12. If action is non-null, then run these steps in parallel:
	if(action){
		stream = Readable.from(action(), {objectMode: false});
	}

	// fetch.spec.13. Let body be a body whose stream is stream, source is source,
	//                and length is length.
	body = {
		stream: stream,
		source: source,
		length: length,
		blobs: blobs,
	};

	return {body, type};
}

/**
 * @func     isFormDataLike
 * @param    {object} object - The object to check.
 * @return   {boolean} true if the given object is an instanceof a FormData constructor, otherwise false.
 * @desc     To determine if the given object is an instanceof a FormData constructor.
 */
function isFormDataLike(object){
	return (
		object &&

		typeof object        === 'object'   &&
		typeof object.append === 'function' &&
		typeof object.delete === 'function' &&
		typeof object.get    === 'function' &&
		typeof object.getAll === 'function' &&
		typeof object.has    === 'function' &&
		typeof object.set    === 'function' &&

		object[Symbol.toStringTag] === 'FormData'
	);
}
