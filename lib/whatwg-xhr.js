/**
 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
 * url: https://xhr.spec.whatwg.org/
 *
 * class XMLHttpRequestEventTarget extends EventTarget
 * class XMLHttpRequestUpload      extends XMLHttpRequestEventTarget
 * const XMLHttpRequestResponseType
 * export class XMLHttpRequest extends XMLHttpRequestEventTarget
 * export class ProgressEvent  extends Event
 * export class FormData
 *
 * function handleError
 * function requestErrorSteps
 * function setResponseToNetworkError
 *
 * function getResponseMimeType
 * function getFinalMimeType
 * function getFinalEncoding
 * function setDocumentResponse
 * function getTextResponse
 *
 * class ClientRequestData
 * function requestDataURL
 *
 * @module  whatwg-xhr
 * @desc    Main module - A Node.js implementation of the {@link https://xhr.spec.whatwg.org/ WHATWG XMLHttpRequest Living Standard} for non-browser environments.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/* Import nodeJS core modules */
import fs                  from 'node:fs';
import http                from 'node:http';
import https               from 'node:https';
import process             from 'node:process';
import threads             from 'node:worker_threads';
import { spawn }           from 'node:child_process';
import { dirname }         from 'node:path';
import { fileURLToPath }   from 'node:url';
import { Readable }        from 'node:stream';

/**
 * Global object available in all node modules >= v17.0.0
 *
 * DOMException  Added in: node v17.0.0
 *
 * @external DOMException
 * @desc Global object available in all node modules >= v17.0.0, defined by {@link https://webidl.spec.whatwg.org/#idl-DOMException WHATWG IDL Living Standard} and implemented by {@link https://nodejs.org/docs/latest/api/globals.html#domexception node.js}.
 */

/**
 * Global object available in all node modules >= v15.4.0.
 *
 * @interface EventTarget
 * @desc A browser-compatible implementation of the EventTarget class, defined by {@link https://dom.spec.whatwg.org/#eventtarget WHATWG DOM Living Standard} and implemented by {@link https://nodejs.org/docs/latest/api/globals.html#eventtarget node.js}.
 */

/**
 * Global object available in all node modules >= v15.4.0.
 *
 * @interface Event
 * @desc A browser-compatible implementation of the Event class, defined by {@link https://dom.spec.whatwg.org/#event WHATWG DOM Living Standard} and implemented by {@link https://nodejs.org/docs/latest/api/globals.html#event node.js}.
 */

/* Import npm-packages dependencies */
import whatwgEncoding      from 'whatwg-encoding';
import htmlEncodingSniffer from 'html-encoding-sniffer';

/* Import from local helper modules */
import {
	parse  as contentTypeParse,
	format as contentTypeFormat
} from './helper/content-type.js';

import {
	dataURLProcessor,
	parseMIMEType,
	serializeAMimeType
} from './helper/whatwg-misc.js';

import {
	forbiddenRequestHeader,
	forbiddenHttpRequestMethod,
	safelyExtractBodyWithType
} from './helper/whatwg-fetch.js';

import {
	xmlEncodingSniffer
} from './helper/xml-encoding-sniffer.js';

/* Emulate commonJS __filename & __dirname global constants */
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

/**
 * @const {boolean} disableHeaderCheck
 * @static
 * @desc  Allow request-headers forbidden by {@link https://xhr.spec.whatwg.org/ XHR Specs}.
 */
export const disableHeaderCheck = false;

/**
 * @func   defaultHeaders
 * @return {object} Default headers to include in each XMLHttpRequest.
 */
const defaultHeaders = () => ({
	'User-Agent' : 'whatwg-xhr',
	'Accept': '*/*',
	'Accept-Language': 'en-US,en;q=0.5'
});
/****/

/**
 * @func   defaultHeadersCase
 * @return {object} Lower case default headers.
 */
const defaultHeadersCase = () => ({
	'user-agent' : 'User-Agent',
	'accept': 'Accept',
	'accept-language': 'Accept-Language'
});
/****/

/** @const {WeakMap} xmlHttpRequestEventTarget - Map any XMLHttpRequestEventTarget object created to an associated data object. */
const xmlHttpRequestEventTarget = new WeakMap();

/** @const {WeakMap} xmlHttpRequest - Map any XMLHttpRequest object created to an associated data object. */
const xmlHttpRequest = new WeakMap();

/** @const {WeakMap} progressEvent - Map any ProgressEvent object created to an associated data object. */
const progressEvent = new WeakMap();

/** @const {WeakMap} formData - Map any FormData object created to an associated data object. */
const formData  = new WeakMap();

let allowXMLHttpRequestUploadConstructor = false;

/**
 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
 * url: https://xhr.spec.whatwg.org/#interface-xmlhttprequest
 *
 * interface XMLHttpRequestEventTarget : EventTarget{
 *   // event handlers
 *   attribute EventHandler onloadstart;
 *   attribute EventHandler onprogress;
 *   attribute EventHandler onabort;
 *   attribute EventHandler onerror;
 *   attribute EventHandler onload;
 *   attribute EventHandler ontimeout;
 *   attribute EventHandler onloadend;
 * };
 *
 * @class     XMLHttpRequestEventTarget
 * @extends   module:whatwg-xhr~EventTarget
 * @desc      Interface that describes the event handlers shared on XMLHttpRequest and XMLHttpRequestUpload interfaces.
 */
class XMLHttpRequestEventTarget extends EventTarget{
	constructor(){
		super();

		const eventHandlers = {};

		eventHandlers['onloadstart'] = null;    // xhr.spec. attribute EventHandler
		eventHandlers['onprogress' ] = null;    // xhr.spec. attribute EventHandler
		eventHandlers['onabort'    ] = null;    // xhr.spec. attribute EventHandler
		eventHandlers['onerror'    ] = null;    // xhr.spec. attribute EventHandler
		eventHandlers['onload'     ] = null;    // xhr.spec. attribute EventHandler
		eventHandlers['ontimeout'  ] = null;    // xhr.spec. attribute EventHandler
		eventHandlers['onloadend'  ] = null;    // xhr.spec. attribute EventHandler

		xmlHttpRequestEventTarget.set(this, eventHandlers);
	}

	/**
	 * @member   {function} onloadstart
	 * @memberof module:whatwg-xhr~XMLHttpRequestEventTarget
	 * @instance
	 * @desc     Get/Set the event handler fired whenever the 'loadstart' event is emitted.
	 */
	get onloadstart(){ return xmlHttpRequestEventTarget.get(this)['onloadstart']; }

	set onloadstart(callback){
		this.removeEventListener('loadstart', xmlHttpRequestEventTarget.get(this)['onloadstart']);
		xmlHttpRequestEventTarget.get(this)['onloadstart'] = null;

		if(typeof callback === 'function'){
			this.addEventListener('loadstart', callback);
			xmlHttpRequestEventTarget.get(this)['onloadstart'] = callback;
		}
	}

	/**
	 * @member   {function} onprogress
	 * @memberof module:whatwg-xhr~XMLHttpRequestEventTarget
	 * @instance
	 * @desc     Get/Set the event handler fired whenever the 'progress' event is emitted.
	 */
	get onprogress(){ return xmlHttpRequestEventTarget.get(this)['onprogress']; }

	set onprogress(callback){
		this.removeEventListener('progress', xmlHttpRequestEventTarget.get(this)['onprogress']);
		xmlHttpRequestEventTarget.get(this)['onprogress'] = null;

		if(typeof callback === 'function'){
			this.addEventListener('progress', callback);
			xmlHttpRequestEventTarget.get(this)['onprogress'] = callback;
		}
	}

	/**
	 * @member   {function} onabort
	 * @memberof module:whatwg-xhr~XMLHttpRequestEventTarget
	 * @instance
	 * @desc     Get/Set the event handler fired whenever the 'abort' event is emitted.
	 */
	get onabort(){ return xmlHttpRequestEventTarget.get(this)['onabort']; }

	set onabort(callback){
		this.removeEventListener('abort', xmlHttpRequestEventTarget.get(this)['onabort']);
		xmlHttpRequestEventTarget.get(this)['onabort'] = null;

		if(typeof callback === 'function'){
			this.addEventListener('abort', callback);
			xmlHttpRequestEventTarget.get(this)['onabort'] = callback;
		}
	}

	/**
	 * @member   {function} onerror
	 * @memberof module:whatwg-xhr~XMLHttpRequestEventTarget
	 * @instance
	 * @desc     Get/Set the event handler fired whenever the 'error' event is emitted.
	 */
	get onerror(){ return xmlHttpRequestEventTarget.get(this)['onerror']; }

	set onerror(callback){
		this.removeEventListener('error', xmlHttpRequestEventTarget.get(this)['onerror']);
		xmlHttpRequestEventTarget.get(this)['onerror'] = null;

		if(typeof callback === 'function'){
			this.addEventListener('error', callback);
			xmlHttpRequestEventTarget.get(this)['onerror'] = callback;
		}
	}

	/**
	 * @member   {function} onload
	 * @memberof module:whatwg-xhr~XMLHttpRequestEventTarget
	 * @instance
	 * @desc     Get/Set the event handler fired whenever the 'load' event is emitted.
	 */
	get onload(){ return xmlHttpRequestEventTarget.get(this)['onload']; }

	set onload(callback){
		this.removeEventListener('load', xmlHttpRequestEventTarget.get(this)['onload']);
		xmlHttpRequestEventTarget.get(this)['onload'] = null;

		if(typeof callback === 'function'){
			this.addEventListener('load', callback);
			xmlHttpRequestEventTarget.get(this)['onload'] = callback;
		}
	}

	/**
	 * @member   {function} ontimeout
	 * @memberof module:whatwg-xhr~XMLHttpRequestEventTarget
	 * @instance
	 * @desc     Get/Set the event handler fired whenever the 'timeout' event is emitted.
	 */
	get ontimeout(){ return xmlHttpRequestEventTarget.get(this)['ontimeout']; }

	set ontimeout(callback){
		this.removeEventListener('timeout', xmlHttpRequestEventTarget.get(this)['ontimeout']);
		xmlHttpRequestEventTarget.get(this)['ontimeout'] = null;

		if(typeof callback === 'function'){
			this.addEventListener('timeout', callback);
			xmlHttpRequestEventTarget.get(this)['ontimeout'] = callback;
		}
	}

	/**
	 * @member   {function} onloadend
	 * @memberof module:whatwg-xhr~XMLHttpRequestEventTarget
	 * @instance
	 * @desc     Get/Set the event handler fired whenever the 'loadend' event is emitted.
	 */
	get onloadend(){ return xmlHttpRequestEventTarget.get(this)['onloadend']; }

	set onloadend(callback){
		this.removeEventListener('loadend', xmlHttpRequestEventTarget.get(this)['onloadend']);
		xmlHttpRequestEventTarget.get(this)['onloadend'] = null;

		if(typeof callback === 'function'){
			this.addEventListener('loadend', callback);
			xmlHttpRequestEventTarget.get(this)['onloadend'] = callback;
		}
	}
}

/**
 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
 * url: https://xhr.spec.whatwg.org/#interface-xmlhttprequest
 *
 * interface XMLHttpRequestUpload : XMLHttpRequestEventTarget {
 * };
 *
 * @class     XMLHttpRequestUpload
 * @extends   module:whatwg-xhr~XMLHttpRequestEventTarget
 * @desc      Interface that represents the upload process for a specific XMLHttpRequest.
 */
class XMLHttpRequestUpload extends XMLHttpRequestEventTarget{
	constructor(){
		super();
		if(!allowXMLHttpRequestUploadConstructor)
			throw new TypeError(`Illegal constructor.`);
	}
}

/**
 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
 * url: https://xhr.spec.whatwg.org/#interface-xmlhttprequest
 *
 * enum XMLHttpRequestResponseType{
 *   "",
 *   "arraybuffer",
 *   "blob",
 *   "document",
 *   "json",
 *   "text"
 * };
 *
 * @const {object} XMLHttpRequestResponseType
 * @desc  Enumerated set of response types.
 */
const XMLHttpRequestResponseType = {
	'': null,
	'arraybuffer': null,
	'blob': null,
	'document': null,
	'json': null,
	'text': null,
};

Object.preventExtensions(XMLHttpRequestResponseType);
Object.freeze(XMLHttpRequestResponseType);

/**
 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
 * url: https://xhr.spec.whatwg.org/#interface-xmlhttprequest
 *
 * interface XMLHttpRequest : XMLHttpRequestEventTarget{
 *   constructor();
 *
 *   // event handler
 *   attribute EventHandler onreadystatechange;
 *
 *   // states
 *   const unsigned short UNSENT = 0;
 *   const unsigned short OPENED = 1;
 *   const unsigned short HEADERS_RECEIVED = 2;
 *   const unsigned short LOADING = 3;
 *   const unsigned short DONE = 4;
 *
 *   readonly attribute unsigned short readyState;
 *
 *   // request
 *   undefined open(ByteString method, USVString url);
 *   undefined open(ByteString method, USVString url, boolean async,
 *                  optional USVString? username = null, optional USVString? password = null);
 *   undefined setRequestHeader(ByteString name, ByteString value);
 *
 *   attribute unsigned long timeout;
 *   attribute boolean       withCredentials;
 *
 *   [SameObject] readonly attribute XMLHttpRequestUpload upload;
 *
 *   undefined send(optional (Document or XMLHttpRequestBodyInit)? body = null);
 *   undefined abort();
 *
 *   // response
 *   readonly attribute USVString      responseURL;
 *   readonly attribute unsigned short status;
 *   readonly attribute ByteString     statusText;
 *
 *   ByteString  getResponseHeader(ByteString name);
 *   ByteString  getAllResponseHeaders();
 *   undefined   overrideMimeType(DOMString mime);
 *
 *   attribute XMLHttpRequestResponseType responseType;
 *
 *   readonly attribute any       response;
 *   readonly attribute USVString responseText;
 *
 *   [Exposed=Window] readonly attribute Document? responseXML;
 * };
 *
 * @class     XMLHttpRequest
 * @extends   module:whatwg-xhr~XMLHttpRequestEventTarget
 * @static
 * @desc      Interface that represents the objects used to interact with a server.
 */
export class XMLHttpRequest extends XMLHttpRequestEventTarget{
	constructor(){
		super();

		const requestData = {};

		// event handler
		requestData['onreadystatechange'] = null;              // xhr.spec. attribute EventHandler

		// states - An XMLHttpRequest object has an associated:
		requestData['readyState'] = this.UNSENT;               // xhr.spec. readonly attribute unsigned short state: initially unsent.

		// requesAn XMLHttpRequest object has an associated:
		requestData['timeout'] = 0;                            // xhr.spec. attribute unsigned long timeout: An unsigned integer, initially 0.
		requestData['withCredentials'] = false;                // xhr.spec. attribute boolean cross-origin credentials: A boolean, initially false.

		allowXMLHttpRequestUploadConstructor = true;           //
		requestData['upload'] = new XMLHttpRequestUpload();    // xhr.spec. readonly attribute XMLHttpRequestUpload upload object: an XMLHttpRequestUpload object.
		allowXMLHttpRequestUploadConstructor = false;          //

		// response - An XMLHttpRequest object has an associated:
		requestData['status'    ] = 0;                 // xhr.spec. readonly attribute unsigned short status;
 		requestData['statusText'] = '';                // xhr.spec. readonly attribute ByteString statusText;

		requestData['response'    ] = '';              // xhr.spec. readonly attribute any response: a response, initially a network error.
		requestData['responseText'] = '';              // xhr.spec. readonly attribute ByteString responseText.
		requestData['responseType'] = '';              // xhr.spec. response type: one of "", "arraybuffer", "blob", "document", "json", and "text"; initially "".
		requestData['responseURL' ] = '';              // xhr.spec. readonly attribute USVString responseURL;
		requestData['responseXML' ] = null;            // xhr.spec. [Exposed=Window] readonly attribute Document? responseXML;

		// associated data - An XMLHttpRequest object has an associated:
		requestData['sendFlag'] = false;               // xhr.spec. send() flag: a flag, initially unset.
		requestData['method'  ] = '';                  // xhr.spec. request method: a method.
		requestData['url'     ] = null;                // xhr.spec. request URL: A URL.
		requestData['async'   ] = true;                // xhr.spec. synchronous flag: a flag, initially unset.

		requestData['user'    ] = null;
		requestData['password'] = null;

		requestData['requestHeaders'    ] = {};        // xhr.spec. author request headers: a header list, initially empty.
		requestData['requestHeadersCase'] = {};

		requestData['requestBody'       ] = null;      // xhr.spec. request body: initially null.
		requestData['uploadCompleteFlag'] = false;     // xhr.spec. upload complete flag: a flag, initially unset.
		requestData['uploadListenerFlag'] = false;     // xhr.spec. upload listener flag: a flag, initially unset.
		requestData['timeoutFlag'       ] = false;     // xhr.spec. timeout flag: a flag, initially unset.
		requestData['receivedBytes'     ] = Buffer.alloc(0);   // xhr.spec. received bytes: a byte sequence, initially the empty byte sequence.
		requestData['responseObject'    ] = null;      // xhr.spec. response object: an object, failure, or null, initially null.
		requestData['fetchController'   ] = null;      // xhr.spec. fetch controller: a fetch controller, initially a new fetch controller.
		requestData['overrideMimeType'  ] = null;      // xhr.spec. A MIME type or null, initially null. Can get a value when overrideMimeType() is invoked.

		requestData['_redirectCount'       ] = 0;     // fetch.spec.2.2.5. A request has an associated redirect count. Unless stated otherwise, it is zero.
		requestData['_responseAbort'       ] = false; // fetch.spec.2.2.6. A response can have an associated aborted flag, which is initially unset.
		requestData['_responseNetworkError'] = false;
		requestData['_responseBody'        ] = null;  // fetch.spec.2.2.6. A response has an associated body (null or a body). Unless stated otherwise it is null.

		xmlHttpRequest.set(this, requestData);
	}

	/**
	 * @member   {function} onreadystatechange
	 * @memberof module:whatwg-xhr.XMLHttpRequest
	 * @instance
	 * @desc     Get/Set the event handler fired whenever there's change in readyState.
	 */
	get onreadystatechange(){ return xmlHttpRequest.get(this)['onreadystatechange']; }

	set onreadystatechange(callback){
		this.removeEventListener('readystatechange', xmlHttpRequest.get(this)['onreadystatechange']);
		xmlHttpRequest.get(this)['onreadystatechange'] = null;

		if(typeof callback === 'function'){
			this.addEventListener('readystatechange', callback);
			xmlHttpRequest.get(this)['onreadystatechange'] = callback;
		}
	}

	/**
	 * @member   {number} readyState
	 * @memberof module:whatwg-xhr.XMLHttpRequest
	 * @readonly
	 * @instance
	 * @desc     Get the state an XMLHttpRequest client is in.
	 */
	get readyState(){ return xmlHttpRequest.get(this)['readyState']; }

	/**
	 * @member   {object} upload
	 * @memberof module:whatwg-xhr.XMLHttpRequest
	 * @readonly
	 * @instance
	 * @desc     Get an XMLHttpRequestUpload object that can be observed to monitor an upload's progress.
	 */
	get upload(){ return xmlHttpRequest.get(this)['upload']; }

	/**
	 * @member   {number} status
	 * @memberof module:whatwg-xhr.XMLHttpRequest
	 * @readonly
	 * @instance
	 * @desc     Get the numerical HTTP status code of the server response.
	 */
	get status(){ return xmlHttpRequest.get(this)['status']; }

	/**
	 * @member   {string} statusText
	 * @memberof module:whatwg-xhr.XMLHttpRequest
	 * @readonly
	 * @instance
	 * @desc     Get the HTTP status message of the server response.
	 */
	get statusText(){ return xmlHttpRequest.get(this)['statusText']; }

	/**
	 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
	 * url: https://xhr.spec.whatwg.org/#the-response-attribute
	 *
	 * client.response
	 *
	 *   Returns the response body.
	 *
	 * The response getter steps are:
	 * 1. If this’s response type is the empty string or "text", then:
	 *     1. If this’s state is not loading or done, then return the empty string.
	 *     2. Return the result of getting a text response for this.
	 * 2. If this’s state is not done, then return null.
	 * 3. If this’s response object is failure, then return null.
	 * 4. If this’s response object is non-null, then return it.
	 * 5. If this’s response type is "arraybuffer", then set this’s response object to a new ArrayBuffer object representing this’s received bytes.
	 *    If this throws an exception, then set this’s response object to failure and return null.
	 *    Note: Allocating an ArrayBuffer object is not guaranteed to succeed. [ECMASCRIPT]
	 * 6. Otherwise, if this’s response type is "blob", set this’s response object to a new Blob object representing this’s received bytes with type
	 *    set to the result of get a final MIME type for this.
	 * 7. Otherwise, if this’s response type is "document", set a document response for this.
	 * 8. Otherwise:
	 *    1. Assert: this’s response type is "json".
	 *    2. If this’s response’s body is null, then return null.
	 *    3. Let jsonObject be the result of running parse JSON from bytes on this’s received bytes. If that threw an exception, then return null.
	 *    4. Set this’s response object to jsonObject.
	 * 9. Return this’s response object.
	 *
	 * @member   {ArrayBuffer|Blob|Document|object|string} response
	 * @memberof module:whatwg-xhr.XMLHttpRequest
	 * @readonly
	 * @instance
	 * @desc     Get the response's body content received from a server following a request being sent.
	 */
	get response(){

		const requestData = xmlHttpRequest.get(this);

		// xhr.spec.1. If this’s response type is the empty string or "text", then:
		if(requestData['responseType'] === '' || requestData['responseType'] === 'text'){

			// xhr.spec.1.1. If this’s state is not loading or done, then return the empty string.
			if(requestData['readyState'] !== this.LOADING && requestData['readyState'] !== this.DONE){
				return '';
			}

			// xhr.spec.1.2. Return the result of getting a text response for this.
			return getTextResponse.call(this);
		}

		// xhr.spec.2. If this’s state is not done, then return null.
		if(requestData['readyState'] !== this.DONE)
			return null;

		// xhr.spec.3. If this’s response object is failure, then return null.
		if(requestData['responseObject'] === 'failure')
			return null;

		// xhr.spec.4. If this’s response object is non-null, then return it.
		if(requestData['responseObject'] !== null)
			return requestData['responseObject'];

		// xhr.spec.5. If this’s response type is "arraybuffer"
		if(requestData['responseType'] === 'arraybuffer'){
			// xhr.spec.5. set this’s response object to a new ArrayBuffer object representing this’s received bytes.
			try{
				requestData['responseObject'] = new Uint8Array(requestData['receivedBytes']).buffer;
			}
			catch(e){
				// xhr.spec.5. If this throws an exception, then set this’s response object to failure and return null.
				requestData['responseObject'] = 'failure';
				return null;
			}
		}
		else
		// xhr.spec.6. Otherwise, if this’s response type is "blob",
		if(requestData['responseType'] === 'blob'){

			// xhr.spec.6. set this’s response object to a new Blob object representing this’s received bytes with type
			// set to the result of get a final MIME type for this.

			if(!(requestData['responseObject'] instanceof Blob)){

				requestData['responseObject'] = new Blob([requestData['receivedBytes']], {
						endings: 'native',
						type: getFinalMimeType.call(this)
					});
			}
		}
		else
		// xhr.spec.7. Otherwise, if this’s response type is "document", set a document response for this.
		if(requestData['responseType'] === 'document'){
			// @todo...
		}
		// xhr.spec.8. Otherwise:
		else{
			// xhr.spec.8.1. Assert: this’s response type is "json".
			if(requestData['responseType'] === 'json'){

				// xhr.spec.8.2. If this’s response’s body is null, then return null.
				// author. if(requestData['_responseBody'] === null)
				if(requestData['receivedBytes'].length === 0)
					return null;

				// xhr.spec.8.3. Let jsonObject be the result of running parse JSON from bytes on this’s received bytes.
				// If that threw an exception, then return null.
				try{
					let jsonObject = JSON.parse(requestData['receivedBytes']);

					// xhr.spec.8.4. Set this’s response object to jsonObject.
					requestData['responseObject'] = jsonObject;
				}catch(e){
					return null;
				}
			}
		}
		// xhr.spec.9. Return this’s response object.
		return requestData['responseObject'];
	}

	/**
	 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
	 * url: https://xhr.spec.whatwg.org/#the-responsetext-attribute
	 *
	 * client.responseText
	 *
	 *    Returns response as text.
	 *    Throws an "InvalidStateError" DOMException if responseType is not the empty string or "text".
	 *
	 * The responseText getter steps are:
	 * 1. If this’s response type is not the empty string or "text", then throw an "InvalidStateError" DOMException.
	 * 2. If this’s state is not loading or done, then return the empty string.
	 * 3. Return the result of <getting a text response> for this.
	 *
	 * @member   {string} responseText
	 * @memberof module:whatwg-xhr.XMLHttpRequest
	 * @readonly
	 * @instance
	 * @desc     Get the text received from a server following a request being sent.
	 */
	get responseText(){
		const requestData = xmlHttpRequest.get(this);

		// xhr.spec.1. If this’s response type is not the empty string or "text", then throw an "InvalidStateError" DOMException.
		if(requestData['responseType'] !== '' && requestData['responseType'] !== 'text')
			throw new DOMException(`XMLHttpRequest.responseText getter: responseText is only available if responseType is '' or 'text'.`, 'InvalidAccessError');

		// xhr.spec.2. If this’s state is not loading or done, then return the empty string.
		if(requestData['readyState'] !== this.LOADING && requestData['readyState'] !== this.DONE){
			return '';
		}

		// xhr.spec.3. Return the result of <getting a text response> for this.
		return getTextResponse.call(this);
	}

	/**
	 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
	 * url: https://xhr.spec.whatwg.org/#the-responsetype-attribute
	 *
	 * client.responseType[ = value ]
	 *
	 *   Returns the response type.
	 *   Can be set to change the response type. Values are: the empty string (default), "arraybuffer", "blob", "document", "json", and "text".
	 *   When set: setting to "document" is ignored if the current global object is not a Window object.
	 *   When set: throws an "InvalidStateError" DOMException if state is loading or done.
	 *   When set: throws an "InvalidAccessError" DOMException if the synchronous flag is set and the current global object is a Window object.
	 *
	 * The responseType getter steps are to return this’s response type.
	 * The responseType setter steps are:
	 * 1. If the current global object is not a Window object and the given value is "document", then return.
	 * 2. If this’s state is loading or done, then throw an "InvalidStateError" DOMException.
	 * 3. If the current global object is a Window object and this’s synchronous flag is set, then throw an "InvalidAccessError" DOMException.
	 * 4. Set this’s response type to the given value.
	 *
	 * @member   {string} responseType
	 * @memberof module:whatwg-xhr.XMLHttpRequest
	 * @instance
	 * @desc     Get/Set an enumerated string value specifying the type of data contained in the response.
	 */
	get responseType(){
		return xmlHttpRequest.get(this)['responseType'];
	}

	set responseType(type){
		if(String(type) in XMLHttpRequestResponseType){
			const requestData = xmlHttpRequest.get(this);

			// xhr.spec.3. If the current global object is a Window object and this’s synchronous flag is set,
			// then throw an "InvalidAccessError" DOMException.

			// @author. xhr.spec.3. will also be applicable to main thread
			if(threads.isMainThread){
				if(!requestData['async'])
					throw new DOMException(
								`XMLHttpRequest.responseType setter: synchronous XMLHttpRequests do not support timeout and responseType`,
								'InvalidAccessError'
					);
			}
			/* node:coverage disable */
			else{
				// xhr.spec.1. If the current global object is not a Window object and the given value is "document", then return.
				if(String(type).toLowerCase() === 'document')
					return;
			}
			/* node:coverage enable */

			// xhr.spec.2. If this’s state is loading or done, then throw an "InvalidStateError" DOMException.
			if(requestData['readyState'] === this.LOADING || requestData['readyState'] === this.DONE)
				throw new DOMException(`XMLHttpRequest.responseType setter: Cannot set 'responseType' property on XMLHttpRequest after 'send()' (when its state is LOADING or DONE).`, 'InvalidStateError');

			requestData['responseType'] = String(type).toLowerCase();
		}
	}

	/**
	 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
	 * url: https://xhr.spec.whatwg.org/#the-responsexml-attribute
	 *
	 * The responseXML getter
	 *
	 * client . responseXML
	 *
	 *  Returns the response as document.
	 *  Throws an "InvalidStateError" DOMException if responseType is not the empty string or "document".
	 *
	 * The responseXML getter steps are:
	 * 1. If this’s response type is not the empty string or "document", then throw an "InvalidStateError" DOMException.
	 * 2. If this’s state is not done, then return null.
	 * 3. Assert: this’s response object is not failure.
	 * 4. If this’s response object is non-null, then return it.
	 * 5. Set a document response for this.
	 * 6. Return this’s response object.
	 *
	 * @member   {Document|null} responseXML
	 * @memberof module:whatwg-xhr.XMLHttpRequest
	 * @readonly
	 * @instance
	 * @desc     Get a Document containing the HTML or XML retrieved by the request, or null.
	 */
	get responseXML(){

		const requestData = xmlHttpRequest.get(this);

		// xhr.spec.1. If this’s response type is not the empty string or "document", then throw an "InvalidStateError" DOMException.
		if(this.responseType !== '' && this.responseType !== 'document'){
			throw new DOMException(
				`XMLHttpRequest.responseXML getter: responseXML is only available if responseType is '' or 'document'.`, 'InvalidStateError');	// firefox 102
		}

		// xhr.spec.2. If this’s state is not done, then return null.
		if(xmlHttpRequest.get(this)['readyState'] !== this.DONE)
			return null;

		// xhr.spec.3. Assert: this’s response object is not failure.
		if(requestData['responseObject'] === 'failure')
			return null;

		// xhr.spec.4. If this’s response object is non-null, then return it.
		if(requestData['responseObject'] !== null)
			return requestData['responseObject'];

		// xhr.spec.5. Set a document response for this.
		setDocumentResponse.call(this);

		// xhr.spec.6. Return this’s response object.
		return xmlHttpRequest.get(this)['responseObject'];
	}

	/**
	 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
	 * url: https://xhr.spec.whatwg.org/#the-responseurl-attribute
	 *
	 * The responseURL getter
	 *
	 * The responseURL getter steps are to return the empty string if this’s response’s URL is null;
	 * otherwise its serialization with the exclude fragment flag set.
	 *
	 * @member   {string} responseURL
	 * @memberof module:whatwg-xhr.XMLHttpRequest
	 * @readonly
	 * @instance
	 * @desc     Get the serialized URL of the response or the empty string if the URL is null.
	 */
	get responseURL(){
		const requestData = xmlHttpRequest.get(this);

		if(requestData['response'] && requestData['response'].url){
			return requestData['response'].url.replace(/#.*$/, '');
		}

		return '';
	}

	/**
	 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
	 * url: https://xhr.spec.whatwg.org/#the-timeout-attribute
	 * client.timeout
	 *
	 *   Can be set to a time in milliseconds. When set to a non-zero value will cause fetching to terminate after the given time has passed.
	 *   When the time has passed, the request has not yet completed, and this’s synchronous flag is unset, a timeout event will then be dispatched,
	 *   or a "TimeoutError" DOMException will be thrown otherwise (for the send() method).
	 *   When set: throws an "InvalidAccessError" DOMException if the synchronous flag is set and the current global object is a Window object.
	 *
	 * The timeout getter steps are to return this’s timeout.
	 * The timeout setter steps are:
	 * 1. If the current global object is a Window object and this’s synchronous flag is set, then throw an "InvalidAccessError" DOMException.
	 * 2. Set this’s timeout to the given value.
	 * Note: This implies that the timeout attribute can be set while fetching is in progress. If that occurs it will still be measured relative
	 *       to the start of fetching.
	 *
	 * @member   {number} timeout
	 * @memberof module:whatwg-xhr.XMLHttpRequest
	 * @instance
	 * @desc     Get/Set an unsigned long representing the number of milliseconds a request can take before automatically being terminated.
	 */
	get timeout(){ return xmlHttpRequest.get(this)['timeout']; }

	set timeout(int){

		// xhr.spec.1. If the current global object is a Window object and this’s synchronous flag is set, then throw an "InvalidAccessError" DOMException.
		if(globalThis.Window && !xmlHttpRequest.get(this)['async'])
 			throw new DOMException(`XMLHttpRequest.timeout setter: synchronous XMLHttpRequests do not support timeout and responseType`, 'InvalidAccessError');

		// @author. xhr.spec.1. will also be applicable to main thread
		if(threads.isMainThread && !xmlHttpRequest.get(this)['async'])
 			throw new DOMException(`XMLHttpRequest.timeout setter: synchronous XMLHttpRequests do not support timeout and responseType`, 'InvalidAccessError');

		// xhr.spec.2. Set this’s timeout to the given value.
		xmlHttpRequest.get(this)['timeout'] = isNaN(int) ? 0 : int;
	}

	/**
	 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
	 * url: https://xhr.spec.whatwg.org/#the-withcredentials-attribute
	 * client.withCredentials
	 *
	 *   True when credentials are to be included in a cross-origin request.
	 *   False when they are to be excluded in a cross-origin request and when cookies are to be ignored in its response. Initially false.
	 *   When set: throws an "InvalidStateError" DOMException if state is not unsent or opened, or if the send() flag is set.
	 *
	 * The withCredentials getter steps are to return this’s cross-origin credentials.
	 * The withCredentials setter steps are:
	 * 1. If this’s state is not unsent or opened, then throw an "InvalidStateError" DOMException.
	 * 2. If this’s send() flag is set, then throw an "InvalidStateError" DOMException.
	 * 3. Set this’s cross-origin credentials to the given value.
	 *
	 * @member   {boolean} withCredentials
	 * @memberof module:whatwg-xhr.XMLHttpRequest
	 * @instance
	 * @desc     Get/Set a boolean value that indicates whether or not cross-site Access-Control requests should be made using credentials.
	 */
	get withCredentials(){ return xmlHttpRequest.get(this)['withCredentials']; }

	set withCredentials(cred = false){
		const requestData = xmlHttpRequest.get(this);

		// xhr.spec.1. If this’s state is not unsent or opened, then throw an "InvalidStateError" DOMException.
		// xhr.spec.2. If this’s send() flag is set, then throw an "InvalidStateError" DOMException.
		if(requestData['readyState'] > this.OPENED || requestData['sendFlag'])
 			throw new DOMException(`XMLHttpRequest.withCredentials setter: XMLHttpRequest must not be sending.`, 'InvalidStateError');

		// xhr.spec.3. Set this’s cross-origin credentials to the given value.
		xmlHttpRequest.get(this)['withCredentials'] = Boolean(cred);
	}
} // @endof class XMLHttpRequest extends XMLHttpRequestEventTarget


/**
 * @const    {number} UNSENT
 * @memberof module:whatwg-xhr.XMLHttpRequest
 * @instance
 * @default  0
 * @desc     State of XMLHttpRequest object, client has been created, open() not called yet.
 */
Object.defineProperty(XMLHttpRequest.prototype, 'UNSENT', {value: 0, writable: false, enumerable: true, configurable: false});

/**
 * @const    {number} OPENED
 * @memberof module:whatwg-xhr.XMLHttpRequest
 * @instance
 * @default  1
 * @desc     State of XMLHttpRequest object, open() has been called.
 */
Object.defineProperty(XMLHttpRequest.prototype, 'OPENED', {value: 1, writable: false, enumerable: true, configurable: false});

/**
 * @const    {number} HEADERS_RECEIVED
 * @memberof module:whatwg-xhr.XMLHttpRequest
 * @instance
 * @default  2
 * @desc     State of XMLHttpRequest object, send() has been called, headers and status are available.
 */
Object.defineProperty(XMLHttpRequest.prototype, 'HEADERS_RECEIVED', {value: 2, writable: false, enumerable: true, configurable: false});

/**
 * @const    {number} LOADING
 * @memberof module:whatwg-xhr.XMLHttpRequest
 * @instance
 * @default  3
 * @desc     State of XMLHttpRequest object, downloading, responseText holds partial data.
 */
Object.defineProperty(XMLHttpRequest.prototype, 'LOADING', {value: 3, writable: false, enumerable: true, configurable: false});

/**
 * @const    {number} DONE
 * @memberof module:whatwg-xhr.XMLHttpRequest
 * @instance
 * @default  4
 * @desc     State of XMLHttpRequest object, the operation is complete.
 */
Object.defineProperty(XMLHttpRequest.prototype, 'DONE', {value: 4, writable: false, enumerable: true, configurable: false});

/**
 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
 * url: https://xhr.spec.whatwg.org/#the-open()-method
 *
 * client.open(method, url [, async = true [, username = null [, password = null]]])
 *
 *   Sets the request method, request URL, and synchronous flag.
 *   Throws a  "SyntaxError"        DOMException if either method is not a valid method or url cannot be parsed.
 *   Throws a  "SecurityError"      DOMException if method is a case-insensitive match for `CONNECT`, `TRACE`, or `TRACK`.
 *   Throws an "InvalidAccessError" DOMException if async is false, the current global object is a Window object, and the timeout attribute is not zero
 *                                  or the responseType attribute is not the empty string.
 *
 * Synchronous XMLHttpRequest outside of workers is in the process of being removed from the web platform as it has detrimental effects to the end user’s
 * experience. (This is a long process that takes many years.) Developers must not pass false for the async argument when the current global object is a
 * Window object. User agents are strongly encouraged to warn about such usage in developer tools and may experiment with throwing an "InvalidAccessError"
 * DOMException when it occurs.
 *
 * The open(method, url) and open(method, url, async, username, password) method steps are:
 *
 *   1. If this’s relevant global object is a Window object and its associated Document is not fully active, then throw an "InvalidStateError" DOMException.
 *   2. If method is not a method, then throw a "SyntaxError" DOMException.
 *   3. If method is a forbidden method, then throw a "SecurityError" DOMException.
 *   4. Normalize method.
 *   5. Let parsedURL be the result of parsing url with this’s relevant settings object’s API base URL and this’s relevant settings object’s API URL
 *      character encoding.
 *   6. If parsedURL is failure, then throw a "SyntaxError" DOMException.
 *   7. If the async argument is omitted, set async to true, and set username and password to null.
 *      Note: Unfortunately legacy content prevents treating the async argument being undefined identical from it being omitted.
 *   8. If parsedURL’s host is non-null, then:
 *      1. If the username argument is not null, set the username given parsedURL and username.
 *      2. If the password argument is not null, set the password given parsedURL and password.
 *   9. If async is false, the current global object is a Window object, and either this’s timeout is not 0 or this’s response type is not the empty
 *      string, then throw an "InvalidAccessError" DOMException.
 *  10. Terminate this’s fetch controller.
 *      Note: A fetch can be ongoing at this point.
 *  11. Set variables associated with the object as follows:
 *        Unset this’s send() flag.
 *        Unset this’s upload listener flag.
 *        Set   this’s request method to method.
 *        Set   this’s request URL to parsedURL.
 *        Set   this’s synchronous flag if async is false; otherwise unset this’s synchronous flag.
 *        Empty this’s author request headers.
 *        Set   this’s response to a network error.
 *        Set   this’s received bytes to the empty byte sequence.
 *        Set   this’s response object to null.
 *      Note: Override MIME type is not overridden here as the overrideMimeType() method can be invoked before the open() method.
 *  12. If this’s state is not opened, then:
 *      1. Set this’s state to opened.
 *      2. Fire an event named readystatechange at this.
 *
 * @method   open
 * @instance
 * @memberof module:whatwg-xhr.XMLHttpRequest
 * @param    {string}  method   - The HTTP request method to use, such as "GET", "POST", "PUT", "DELETE", etc. Ignored for non-HTTP(S) URLs.
 * @param    {string}  url      - A string or any other object with a stringifier that provides the URL of the resource to request.
 * @param    {boolean} is_async - (Optional) Boolean parameter, defaulting to true, indicating whether or not to perform the operation asynchronously.
 * @param    {string}  username - (Optional) user name to use for authentication purposes; by default, this is the null value.
 * @param    {string}  password - (Optional) password to use for authentication purposes; by default, this is the null value.
 * @desc     XMLHttpRequest method that initializes a newly-created request, or re-initializes an existing one.
 * @requires module:whatwg-fetch.forbiddenHttpRequestMethod
 */
XMLHttpRequest.prototype.open = function open(method, url, is_async = true, username = null, password = null){

	// xhr.spec.1. If this’s relevant global object is a Window object and its associated Document is not fully active, then throw an "InvalidStateError" DOMException.
	if(globalThis.Window && !document.isConnected)
 		throw new DOMException(`XMLHttpRequest.open: ......`, 'InvalidStateError');

	// xhr.spec.2. If method is not a method, then throw a "SyntaxError" DOMException
	if(typeof method === 'function')
		throw new DOMException(`XMLHttpRequest.open: an invalid or illegal method string was specified`, 'SyntaxError');

	// xhr.spec.2. If method is not a method, then throw a "SyntaxError" DOMException
	method = String(method);
	if(/[^\w]/.test(method))
 		throw new DOMException(`XMLHttpRequest.open: an invalid or illegal method string was specified`, 'SyntaxError');

	// xhr.spec.3. If method is a forbidden method, then throw a "SecurityError" DOMException
	if(forbiddenHttpRequestMethod.has(String(method).toLowerCase()))
		throw new DOMException(`XMLHttpRequest.open: the operation is insecure.`, 'SecurityError');

	// xhr.spec.4. Normalize method.
	// fetch.spec. To normalize a method, if it is a byte-case-insensitive match for `DELETE`, `GET`, `HEAD`, `OPTIONS`, `POST`, or `PUT`, byte-uppercase it.
	method = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'].find(m => m === String(method).toUpperCase()) || String(method);

	// xhr.spec.5. Let parsedURL be the result of parsing url with this’s relevant settings object’s API base URL and
	//             this’s relevant settings object’s API URL character encoding.
	let parsedURL;
	try{
		parsedURL = new URL(url);
	}
	catch(e){
		// xhr.spec.6. If parsedURL is failure, then throw a "SyntaxError" DOMException
 		throw new DOMException(`XMLHttpRequest.open: an invalid or illegal url string was specified`, 'SyntaxError');
	}

	// xhr.spec.7. If the async argument is omitted, set async to true, and set username and password to null.
	// @author: already handled by default arguments: open(method, url, is_async = true, username = null, password = null)

	// xhr.spec.8. If parsedURL’s host is non-null, then:
	if(parsedURL.host){
		// xhr.spec.8.1. If the username argument is not null, set the username given parsedURL and username.
		if(username){
		/*
		 * URL Living Standard — Last Updated 24 May 2023
		 * url: https://url.spec.whatwg.org/#set-the-username
		 *
		 * To set the username given a url and username, set url’s username to the result of running UTF-8 percent-encode on username
		 * using the userinfo percent-encode set.
		 */
			parsedURL.username = username;
		}
		// xhr.spec.8.2. If the password argument is not null, set the password given parsedURL and password.
		if(password){
		/*
		 * URL Living Standard — Last Updated 24 May 2023
		 * url: https://url.spec.whatwg.org/#set-the-password
		 *
		 * To set the password given a url and password, set url’s password to the result of running UTF-8 percent-encode on password
		 * using the userinfo percent-encode set.
		 */
			parsedURL.password = password;
		}
	}

	const requestData = xmlHttpRequest.get(this);

	// xhr.spec.9. If async is false, the current global object is a Window object, and either this’s timeout is not 0 or this’s response type is not the empty
	//             string, then throw an "InvalidAccessError" DOMException.
	if(globalThis.Window && is_async === false && (requestData['timeout'] || requestData['responseType']))
		throw new DOMException(`XMLHttpRequest.open: synchronous XMLHttpRequests do not support timeout and responseType`, 'InvalidAccessError');

	// @author. xhr.spec.9. will also be applicable to main thread
	if(threads.isMainThread && is_async === false && (requestData['timeout'] || requestData['responseType']))
		throw new DOMException(`XMLHttpRequest.open: synchronous XMLHttpRequests do not support timeout and responseType`, 'InvalidAccessError');

	// xhr.spec.10. Terminate this’s fetch controller. Note: A fetch can be ongoing at this point.
	if(requestData['fetchController']){
		requestData['fetchController'].destroy();
		requestData['fetchController'] = null;
	}

	// xhr.spec.11. Set variables associated with the object as follows:
	// xhr.spec.11. Unset this’s send() flag.
	requestData['sendFlag'] = false;

	// xhr.spec.11. Unset this’s upload listener flag.
	requestData['uploadListenerFlag'] = false;

	// xhr.spec.11. Set this’s request method to method.
	requestData['method'] = method;

	// xhr.spec.11. Set this’s request URL to parsedURL.
	requestData['url'] = parsedURL.href;

	// xhr.spec.11. Set this’s synchronous flag if async is false; otherwise unset this’s synchronous flag.
	requestData['async'] = !(is_async === false);

	// xhr.spec.11. Empty this’s author request headers.

	requestData['requestHeaders'    ] = {};
	requestData['requestHeadersCase'] = {};

	// xhr.spec.11. Set this’s response to a network error.
	setResponseToNetworkError.call(this);

	// xhr.spec.11. Set this’s received bytes to the empty byte sequence.
	requestData['receivedBytes'] = Buffer.alloc(0);

	// xhr.spec.11. Set this’s response object to null.
	requestData['responseObject'] = null;

	// xhr.spec.12. If this’s state is not opened, then:
	if(requestData['readyState'] !== this.OPENED){

		// xhr.spec.12.1. Set this’s state to opened.
		requestData['readyState'] = this.OPENED;

		// xhr.spec.12.2. Fire an event named readystatechange at this.
		this.dispatchEvent(new Event('readystatechange'));
	}
}; // @endof method XMLHttpRequest.prototype.open

/**
 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
 * url: https://xhr.spec.whatwg.org/#the-abort()-method
 *
 * client.abort()
 *   Cancels any network activity.
 *
 * The abort() method steps are:
 * 1. Abort this’s fetch controller.
 * 2. If this’s state is opened with this’s send() flag set, headers received, or loading, then run the request error steps for this and abort.
 * 3. If this’s state is done, then set this’s state to unsent and this’s response to a network error.
 * Note: No readystatechange event is dispatched.
 *
 * @method   abort
 * @instance
 * @memberof module:whatwg-xhr.XMLHttpRequest
 * @desc     XMLHttpRequest method that aborts the request if it has already been sent.
 */
XMLHttpRequest.prototype.abort = function abort(){

	const requestData = xmlHttpRequest.get(this);

	// xhr.spec.1. Abort this’s fetch controller
	if(requestData['fetchController']){
		requestData['fetchController'].destroy();
		requestData['fetchController'] = null;
	}

	// xhr.spec.2. If this’s state is opened with this’s send() flag set, headers received,
	//             or loading, then run the request error steps for this and abort.
	if(
		requestData['readyState'] === this.OPENED && requestData['sendFlag'] ||
		requestData['readyState'] === this.HEADERS_RECEIVED ||
		requestData['readyState'] === this.LOADING
	){
		requestErrorSteps.call(this, 'abort');
	}

	// xhr.spec.3. If this’s state is done, then set this’s state to unsent and this’s response to a network error.
	if(requestData['readyState'] === this.DONE){

		requestData['readyState'] = this.UNSENT;
		setResponseToNetworkError.call(this);
	}
}; // @endof method XMLHttpRequest.prototype.abort

/**
 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
 * url: https://xhr.spec.whatwg.org/#the-setrequestheader()-method
 *
 * client.setRequestHeader(name, value)
 *   Appends a value to an existing request header or adds a new request header.
 *   Throws an "InvalidStateError" DOMException if either state is not opened or the send() flag is set.
 *   Throws a "SyntaxError" DOMException if name is not a header name or if value is not a header value.
 *
 * The setRequestHeader(name, value) method must run these steps:
 *   1. If this’s state is not opened, then throw an "InvalidStateError" DOMException.
 *   2. If this’s send() flag is set, then throw an "InvalidStateError" DOMException.
 *   3. Normalize value.
 *   4. If name is not a header name or value is not a header value, then throw a "SyntaxError" DOMException.
 *   5. An empty byte sequence represents an empty header value.
 *   6. If (name, value) is a forbidden request-header, then return.
 *   7. Combine (name, value) in this’s author request headers.
 *
 * @method   setRequestHeader
 * @instance
 * @memberof module:whatwg-xhr.XMLHttpRequest
 * @param    {string}  name  - The name of the header whose value is to be set.
 * @param    {string}  value - The value to set as the body of the header.
 * @desc     XMLHttpRequest method that sets the value of an HTTP request header.
 * @requires module:whatwg-fetch.forbiddenRequestHeader
 */
XMLHttpRequest.prototype.setRequestHeader = function setRequestHeader(name, value){

	// @author: validate the number of arguments
	if(arguments.length < 2)
		throw new TypeError(`XMLHttpRequest.setRequestHeader: At least 2 arguments required, but only ${arguments.length} passed`);	// firefox 102

	const requestData = xmlHttpRequest.get(this);

	// xhr.spec.1. If this’s state is not opened, then throw an "InvalidStateError" DOMException.
	if(requestData['readyState'] !== this.OPENED)
		throw new DOMException(`XMLHttpRequest.send: XMLHttpRequest state must be OPENED.`, 'InvalidStateError');	// firefox 102

	// xhr.spec.2. If this’s send() flag is set, then throw an "InvalidStateError" DOMException.
	if(requestData['sendFlag'])
		throw new DOMException(`XMLHttpRequest.send: XMLHttpRequest must not be sending.`, 'InvalidStateError');	// firefox 102

	// xhr.spec.3. Normalize value.
	// fetch.spec. To normalize a byte sequence potentialValue, remove any leading and trailing HTTP whitespace bytes from potentialValue.
	value = String(value).trim();

	// xhr.spec.4. If name is not a header name or value is not a header value, then throw a "SyntaxError" DOMException.
	try{
		http.validateHeaderName(name);
	}
	catch(err){

		name = String(name);
		for(let i = 0; i < name.length; i++){
			if(name[i].codePointAt(0) > 0xFF){
				let msg = '';

				msg += `XMLHttpRequest.setRequestHeader: `;
				msg += `Cannot convert argument 1 to ByteString because the character at index ${i} `;
				msg += `has value ${name[i].codePointAt(0)} which is greater than 255.`

				throw new TypeError(msg); // firefox 102
			}
		}

		throw new DOMException(`XMLHttpRequest.setRequestHeader: Invalid header name.`, 'SyntaxError');	// firefox 102
	}

	try{
		http.validateHeaderValue(name, value);
	}
	catch(err){

		for(let i = 0; i < value.length; i++){
			if(value[i].codePointAt(0) > 0xFF){
				let msg = '';

				msg += `XMLHttpRequest.setRequestHeader: `;
				msg += `Cannot convert argument 2 to ByteString because the character at index ${i} `;
				msg += `has value ${value[i].codePointAt(0)} which is greater than 255.`

				throw new TypeError(msg); // firefox 102
			}
		}

		throw new DOMException(`XMLHttpRequest.setRequestHeader: Invalid header value.`, 'SyntaxError'); // firefox 102
	}

	// xhr.spec.6. If (name, value) is a forbidden request-header, then return.
	if(forbiddenRequestHeader(name, value)){
		return;
	}

	const headers     = requestData['requestHeaders'];
	const headersCase = requestData['requestHeadersCase'];

	// xhr.spec.7. Combine (name, value) in this’s author request headers.
	if(headersCase[name.toLowerCase()]){
		let nameCase = headersCase[name.toLowerCase()];
		headers[nameCase] = headers[nameCase] ? headers[nameCase] + ', ' + value : value;
	}
	else{
		headersCase[name.toLowerCase()] = name;
		headers[name] = value;
	}
}; // @endof method XMLHttpRequest.prototype.setRequestHeader

/**
 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
 * url: https://xhr.spec.whatwg.org/#the-send()-method
 *
 * client.send([body = null])
 *   Initiates the request. The body argument provides the request body, if any, and is ignored if the request method is GET or HEAD.
 *   Throws an "InvalidStateError" DOMException if either state is not opened or the send() flag is set.
 *
 * The send(body) method steps are:
 *   1. If this’s state is not opened, then throw an "InvalidStateError" DOMException.
 *   2. If this’s send() flag is set, then throw an "InvalidStateError" DOMException.
 *   3. If this’s request method is `GET` or `HEAD`, then set body to null.
 *   4. If body is not null, then:
 *      1. Let extractedContentType be null.
 *      2. If body is a Document, then set this’s request body to body, serialized, converted, and UTF-8 encoded.
 *      3. Otherwise:
 *         1. Let bodyWithType be the result of safely extracting body.
 *         2. Set this’s request body to bodyWithType’s body.
 *         3. Set extractedContentType to bodyWithType’s type.
 *      4. Let originalAuthorContentType be the result of getting `Content-Type` from this’s author request headers.
 *      5. If originalAuthorContentType is non-null, then:
 *         1. If body is a Document or a USVString, then:
 *            1. Let contentTypeRecord be the result of parsing originalAuthorContentType.
 *            2. If contentTypeRecord is not failure, contentTypeRecord’s parameters["charset"] exists, and parameters["charset"] is not an ASCII case-insensitive
 *               match for "UTF-8", then:
 *               1. Set contentTypeRecord’s parameters["charset"] to "UTF-8".
 *               2. Let newContentTypeSerialized be the result of serializing contentTypeRecord.
 *               3. Set (`Content-Type`, newContentTypeSerialized) in this’s author request headers.
 *      6. Otherwise:
 *         1. If body is an HTML document, then set (`Content-Type`, `text/html;charset=UTF-8`) in this’s author request headers.
 *         2. Otherwise, if body is an XML document, set (`Content-Type`, `application/xml;charset=UTF-8`) in this’s author request headers.
 *         3. Otherwise, if extractedContentType is not null, set (`Content-Type`, extractedContentType) in this’s author request headers.
 *   5. If one or more event listeners are registered on this’s upload object, then set this’s upload listener flag.
 *   6. Let req be a new request, initialized as follows:
 *        method                    This’s request method.
 *        URL                       This’s request URL.
 *        header list               This’s author request headers.
 *        unsafe-request flag       Set.
 *        body                      This’s request body.
 *        client                    This’s relevant settings object.
 *        mode                      "cors".
 *        use-CORS-preflight flag   Set if this’s upload listener flag is set.
 *        credentials mode          If this’s cross-origin credentials is true, then "include"; otherwise "same-origin".
 *        use-URL-credentials flag  Set if this’s request URL includes credentials.
 *        initiator type            "xmlhttprequest".
 *   7. Unset this’s upload complete flag.
 *   8. Unset this’s timed out flag.
 *   9. If req’s body is null, then set this’s upload complete flag.
 *  10. Set this’s send() flag.
 *  11. If this’s synchronous flag is unset, then:
 *      1. Fire a progress event named loadstart at this with 0 and 0.
 *      2. Let requestBodyTransmitted be 0.
 *      3. Let requestBodyLength be req’s body’s length, if req’s body is non-null; otherwise 0.
 *      4. Assert: requestBodyLength is an integer.
 *      5. If this’s upload complete flag is unset and this’s upload listener flag is set, then fire a progress event named loadstart at this’s upload object
 *         with requestBodyTransmitted and requestBodyLength.
 *      6. If this’s state is not opened or this’s send() flag is unset, then return.
 *      7. Let processRequestBodyChunkLength, given a bytesLength, be these steps:
 *         1. Increase requestBodyTransmitted by bytesLength.
 *         2. If not roughly 50ms have passed since these steps were last invoked, then return.
 *         3. If this’s upload listener flag is set, then fire a progress event named progress at this’s upload object with requestBodyTransmitted and
 *            requestBodyLength.
 *         Note: These steps are only invoked when new bytes are transmitted.
 *      8. Let processRequestEndOfBody be these steps:
 *         1. Set this’s upload complete flag.
 *         2. If this’s upload listener flag is unset, then return.
 *         3. Fire a progress event named progress at this’s upload object with requestBodyTransmitted and requestBodyLength.
 *         4. Fire a progress event named load at this’s upload object with requestBodyTransmitted and requestBodyLength.
 *         5. Fire a progress event named loadend at this’s upload object with requestBodyTransmitted and requestBodyLength.
 *      9. Let processResponse, given a response, be these steps:
 *         1. Set this’s response to response.
 *         2. Handle errors for this.
 *         3. If this’s response is a network error, then return.
 *         4. Set this’s state to headers received.
 *         5. Fire an event named readystatechange at this.
 *         6. If this’s state is not headers received, then return.
 *         7. If this’s response’s body is null, then run handle response end-of-body for this and return.
 *         8. Let length be the result of extracting a length from this’s response’s header list.
 *         9. If length is not an integer, then set it to 0.
 *        10. Let processBodyChunk given bytes be these steps:
 *            1. Append bytes to this’s received bytes.
 *            2. If not roughly 50ms have passed since these steps were last invoked, then return.
 *            3. If this’s state is headers received, then set this’s state to loading.
 *            4. Fire an event named readystatechange at this.
 *               Note: Web compatibility is the reason readystatechange fires more often than this’s state changes.
 *            5. Fire a progress event named progress at this with this’s received bytes’s length and length.
 *        11. Let processEndOfBody be this step: run handle response end-of-body for this.
 *        12. Let processBodyError be these steps:
 *            1. Set this’s response to a network error.
 *            2.  Run handle errors for this.
 *        13. Incrementally read this’s response’s body, given processBodyChunk, processEndOfBody, processBodyError, and this’s relevant global object.
 *     10. Set this’s fetch controller to the result of fetching req with processRequestBodyChunkLength set to processRequestBodyChunkLength,
 *         processRequestEndOfBody set to processRequestEndOfBody, and processResponse set to processResponse.
 *     11. Let now be the present time.
 *     12. Run these steps in parallel:
 *         1. Wait until either req’s done flag is set or this’s timeout is not 0 and this’s timeout milliseconds have passed since now.
 *         2. If req’s done flag is unset, then set this’s timed out flag and terminate this’s fetch controller.
 *  12. Otherwise, if this’s synchronous flag is set:
 *      1. Let processedResponse be false.
 *      2. Let processResponseConsumeBody, given a response and nullOrFailureOrBytes, be these steps:
 *         1. If nullOrFailureOrBytes is not failure, then set this’s response to response.
 *         2. If nullOrFailureOrBytes is a byte sequence, then append nullOrFailureOrBytes to this’s received bytes.
 *         3. Set processedResponse to true.
 *      3. Set this’s fetch controller to the result of fetching req with processResponseConsumeBody set to processResponseConsumeBody and
 *         useParallelQueue set to true.
 *      4. Let now be the present time.
 *      5. Pause until either processedResponse is true or this’s timeout is not 0 and this’s timeout milliseconds have passed since now.
 *      6. If processedResponse is false, then set this’s timed out flag and terminate this’s fetch controller.
 *      7. Report timing for this’s fetch controller given the current global object.
 *      8. Run handle response end-of-body for this.
 *
 * To handle response end-of-body for an XMLHttpRequest object xhr, run these steps:
 *      1. Handle errors for xhr.
 *      2. If xhr’s response is a network error, then return.
 *      3. Let transmitted be xhr’s received bytes’s length.
 *      4. Let length be the result of extracting a length from this’s response’s header list.
 *      5. If length is not an integer, then set it to 0.
 *      6. If xhr’s synchronous flag is unset, then fire a progress event named progress at xhr with transmitted and length.
 *      7. Set xhr’s state to done.
 *      8. Unset xhr’s send() flag.
 *      9. Fire an event named readystatechange at xhr.
 *     10. Fire a progress event named load at xhr with transmitted and length.
 *     11. Fire a progress event named loadend at xhr with transmitted and length.
 *
 * @method   send
 * @instance
 * @memberof module:whatwg-xhr.XMLHttpRequest
 * @param    {Document| Blob|ArrayBuffer|TypedArray|DataView|FormData|URLSearchParams|string|null} body - The request body.
 * @desc     XMLHttpRequest method that sends the request to the server.
 * @requires module:whatwg-fetch.safelyExtractBodyWithType
 * @requires module:helper-content-type.parse
 * @requires module:helper-content-type.format
 */
XMLHttpRequest.prototype.send = function send(body = null){

	const xhr = this;
	const requestData = xmlHttpRequest.get(xhr);

	// xhr.spec.1. If this’s state is not opened, then throw an "InvalidStateError" DOMException.
	if(requestData['readyState'] !== xhr.OPENED)
		throw new DOMException(`XMLHttpRequest.send: XMLHttpRequest state must be OPENED.`, 'InvalidStateError');	// firefox 102

	// xhr.spec.2. If this’s send() flag is set, then throw an "InvalidStateError" DOMException.
	if(requestData['sendFlag'])
		throw new DOMException(`XMLHttpRequest.send: XMLHttpRequest must not be sending.`, 'InvalidStateError');	// firefox 102

	// xhr.spec.3. If this’s request method is `GET` or `HEAD`, then set body to null.
	if(requestData['method'].toUpperCase() === 'GET' || requestData['method'].toUpperCase() === 'HEAD'){
		body = null;
	}

	// xhr.spec.4. If body is not null, then:
	if(body !== null && body !== ''){

		// xhr.spec.4.1. Let extractedContentType be null.
		let extractedContentType = null;

		// xhr.spec.4.2. If body is a Document, then set this’s request body to body, serialized, converted, and UTF-8 encoded.
		if(globalThis.Document && body instanceof globalThis.Document){
			// @todo: xhr.spec.4.2. set this’s request body to body, serialized, converted, and UTF-8 encoded.
		}
		// xhr.spec.4.3. Otherwise:
		else{
			// xhr.spec.4.3.1. Let bodyWithType be the result of safely extracting body.
			let bodyWithType = safelyExtractBodyWithType(body);

			// xhr.spec.4.3.2. Set this’s request body to bodyWithType’s body.
			requestData['requestBody'] = bodyWithType.body;

			// xhr.spec.4.3.3. Set extractedContentType to bodyWithType’s type.
			extractedContentType = bodyWithType.type;
		}

		// xhr.spec.4.4. Let originalAuthorContentType be the result of getting `Content-Type` from this’s author request headers.
		let originalAuthorContentType = null;

		if(requestData['requestHeadersCase']['content-type'])
			originalAuthorContentType = requestData['requestHeaders'][requestData['requestHeadersCase']['content-type']];

		// xhr.spec.4.5. If originalAuthorContentType is non-null, then:
		if(originalAuthorContentType !== null){

			// xhr.spec.4.5.1. If body is a Document or a USVString, then:
			if(
				(globalThis.Document && body instanceof globalThis.Document) ||
				typeof body === 'string' || typeof requestData['requestBody'].source === 'string'){
				try{
					// xhr.spec.4.5.1.1. Let contentTypeRecord be the result of parsing originalAuthorContentType.
					const contentTypeRecord = contentTypeParse(originalAuthorContentType);

					// xhr.spec.4.5.1.2. If contentTypeRecord is not failure,
					//                   contentTypeRecord’s parameters["charset"] exists,
					//                   and parameters["charset"] is not an ASCII case-insensitive match for "UTF-8", then:
					let charset = contentTypeRecord.parameters['charset'];
					if(charset && charset.toUpperCase() !== 'UTF-8'){

						// xhr.spec.4.5.1.2.1. Set contentTypeRecord’s parameters["charset"] to "UTF-8".
						contentTypeRecord.parameters['charset'] = 'UTF-8';

						// xhr.spec.4.5.1.2.2. Let newContentTypeSerialized be the result of serializing contentTypeRecord.
						let newContentTypeSerialized = contentTypeFormat(contentTypeRecord);

						// xhr.spec.4.5.1.2.3. Set (`Content-Type`, newContentTypeSerialized) in this’s author request headers.
						// @author: first delete the existing Content-Type header
						delete requestData['requestHeaders'][requestData['requestHeadersCase']['content-type']];
						delete requestData['requestHeadersCase']['content-type'];

						this.setRequestHeader('Content-Type', newContentTypeSerialized);
					}
				}catch(e){}
			}
		}
		// xhr.spec.4.6. Otherwise:
		else{
			// xhr.spec.4.6.1. If body is an HTML document, then set (`Content-Type`, `text/html;charset=UTF-8`) in this’s author request headers.
			if(globalThis.Document && body instanceof globalThis.Document && body.type === 'html')
				this.setRequestHeader('Content-Type', 'text/html;charset=UTF-8');
			else
			// xhr.spec.4.6.2. Otherwise, if body is an XML document, set (`Content-Type`, `application/xml;charset=UTF-8`) in this’s author request headers.
			if(globalThis.Document && body instanceof globalThis.Document && body.type === 'xml')
				this.setRequestHeader('Content-Type', 'application/xml;charset=UTF-8');
			else
			// xhr.spec.4.6.3. Otherwise, if extractedContentType is not null, set (`Content-Type`, extractedContentType) in this’s author request headers.
			if(extractedContentType){
				this.setRequestHeader('Content-Type', extractedContentType);
			}
		}
	} // @endof if(body !== null && body !== undefined)

	// xhr.spec.5. If one or more event listeners are registered on this’s upload object, then set this’s upload listener flag.
	if(
		requestData['upload']['onloadstart'] !== null ||
		requestData['upload']['onprogress' ] !== null ||
		requestData['upload']['onabort'    ] !== null ||
		requestData['upload']['onerror'    ] !== null ||
		requestData['upload']['onload'     ] !== null ||
		requestData['upload']['ontimeout'  ] !== null ||
		requestData['upload']['onloadend'  ] !== null
	){
		requestData['uploadListenerFlag'] = true;
	}
	else
	if(Object.getOwnPropertySymbols(requestData['upload']).filter(e => requestData['upload'][e].size).length){
		requestData['uploadListenerFlag'] = true;
	}

	// xhr.spec.6. Let req be a new request, initialized as follows:
	let req_auth = requestData['user'] ? `${requestData['user']}:${requestData['password'] === undefined ? '' : requestData['password']}` : undefined;

	// xhr.spec.6. method: This’s request method.
	let req_method = requestData['method'];

	// xhr.spec.6. URL: This’s request URL.
	let req_url = new URL(requestData['url']);

	let req_host     = req_url.hostname;
	let req_port     = req_url.port || (req_url.protocol === 'https:' ? 443 : 80);
	let req_url_path = req_url.pathname + (req_url.search ? req_url.search : '');
	let req_protocol = req_url.protocol;

	// xhr.spec.6. header list: This’s author request headers.
	const req_headers     = requestData['requestHeaders'];
	const req_headersCase = requestData['requestHeadersCase'];

	for(let name in defaultHeaders()){
		if(!req_headersCase[name.toLowerCase()]){
			xhr.setRequestHeader(name, defaultHeaders()[name]);
		}
	}

	// xhr.spec.6. unsafe-request flag: Set.
	// xhr.spec.6. body: This’s request body.
	// xhr.spec.6. client: This’s relevant settings object.
	// xhr.spec.6. mode: "cors".
	// xhr.spec.6. use-CORS-preflight flag: Set if this’s upload listener flag is set.
	// xhr.spec.6. credentials mode: If this’s cross-origin credentials is true, then "include"; otherwise "same-origin".
	// xhr.spec.6. use-URL-credentials flag:  Set if this’s request URL includes credentials.
	// xhr.spec.6. initiator type: "xmlhttprequest".

	// author. use http.request(url[, options][, callback])
	const clientRequestOptions = {
		agent:           false,
		auth:            req_auth,
		headers:         req_headers,
		host:            req_host,
		port:            req_port,
		method:          req_method,
		path:            req_url_path,
		protocol:        req_url.protocol,
		setHost:         true,
		timeout:         requestData['timeout'],
		withCredentials: requestData['withCredentials'],

		// insecureHTTPParser: true,
		url:             requestData['url'],
	};

	// author. choose the proper protocol
	let doClientRequest;

	if(req_protocol === 'https:')
		doClientRequest = https.request;
	else
	if(req_protocol === 'http:')
		doClientRequest = http.request;
	else
	if(req_protocol === 'data:')
		doClientRequest = requestDataURL;
	else
		doClientRequest = http.request;

	// xhr.spec.7. Unset this’s upload complete flag.
	requestData['uploadCompleteFlag'] = false;

	// xhr.spec.8. Unset this’s timed out flag.
	requestData['timeoutFlag'] = false;

	// xhr.spec.9. If req’s body is null, then set this’s upload complete flag.
	if(requestData['requestBody'] === null)
		requestData['uploadCompleteFlag'] = true;

	// xhr.spec.10. Set this’s send() flag.
	requestData['sendFlag'] = true;

	// xhr.spec.11. If this’s synchronous flag is unset, then:
	if(requestData['async']){

		// xhr.spec.11.1. Fire a progress event named loadstart at this with 0 and 0.
		xhr.dispatchEvent(new ProgressEvent('loadstart', {loaded: 0, total: 0}));

		// xhr.spec.11.2. Let requestBodyTransmitted be 0.
		let requestBodyTransmitted = 0;

		// xhr.spec.11.3. Let requestBodyLength be req’s body’s length, if req’s body is non-null; otherwise 0.
		let requestBodyLength = requestData['requestBody'] ? requestData['requestBody'].length : 0;

		// xhr.spec.11.4. Assert: requestBodyLength is an integer.
		if(isNaN(requestBodyLength))
			requestBodyLength = 0;

		// xhr.spec.11.5. If this’s upload complete flag is unset and this’s upload listener flag is set,
		// then fire a progress event named loadstart at this’s upload object with requestBodyTransmitted and requestBodyLength.
		if(!requestData['uploadCompleteFlag'] && requestData['uploadListenerFlag'])
			requestData['upload'].dispatchEvent(new ProgressEvent('loadstart', {loaded: requestBodyTransmitted, total: requestBodyLength}));

		// xhr.spec.11.6. If this’s state is not opened or this’s send() flag is unset, then return.
		if(requestData['readyState'] !== xhr.OPENED || !requestData['sendFlag'])
			return;

		// xhr.spec.11.7. Let processRequestBodyChunkLength, given a bytesLength, be these steps:
		//                Note: These steps are only invoked when new bytes are transmitted.
		const processRequestBodyChunkLength = () => {
			let bytesLength = requestData['requestBody'].length; // @?????

			// xhr.spec.11.7.1. Increase requestBodyTransmitted by bytesLength.
			requestBodyTransmitted += bytesLength;

			// xhr.spec.11.7.2. If not roughly 50ms have passed since these steps were last invoked, then return.
			// @todo...

			// xhr.spec.11.7.3. If this’s upload listener flag is set, then fire a progress event named progress at this’s upload object
			//                  with requestBodyTransmitted and requestBodyLength.
			if(requestData['uploadListenerFlag']){
				requestData['upload'].dispatchEvent(new ProgressEvent('progress', {loaded: requestBodyTransmitted, total: requestBodyLength}));
			}
		}

		// xhr.spec.11.8. Let processRequestEndOfBody be these steps:
		const processRequestEndOfBody = () => {

			// xhr.spec.11.8.1. Set this’s upload complete flag.
			requestData['uploadCompleteFlag'] = true;

			// xhr.spec.11.8.2. If this’s upload listener flag is unset, then return.
			if(!requestData['uploadListenerFlag']) return;

			// xhr.spec.11.8.3. Fire a progress event named progress at this’s upload object with requestBodyTransmitted and requestBodyLength.
			// requestData['upload'].dispatchEvent(new ProgressEvent('progress', {loaded: requestBodyTransmitted, total: requestBodyLength}));

			// xhr.spec.11.8.4. Fire a progress event named load at this’s upload object with requestBodyTransmitted and requestBodyLength.
			requestData['upload'].dispatchEvent(new ProgressEvent('load', {loaded: requestBodyTransmitted, total: requestBodyLength}));

			// xhr.spec.11.8.5. Fire a progress event named loadend at this’s upload object with requestBodyTransmitted and requestBodyLength.
			requestData['upload'].dispatchEvent(new ProgressEvent('loadend', {loaded: requestBodyTransmitted, total: requestBodyLength}));
		}

		// xhr.spec.11.9. Let processResponse, given a response, be these steps:
		const processResponse = (response) => {

			// xhr.spec.11.9.1. Set this’s response to response.
			requestData['response'] = response;

			// xhr.spec.11.9.2. Handle errors for this. // @?????
			handleError.call(xhr);

			// xhr.spec.11.9.3. If this’s response is a network error, then return. // @?????
			if(!response.statusCode){
				setResponseToNetworkError.call(this);
				return;
			}
			else
			if( response.headers['location'] &&
				(
					response.statusCode === 301 ||
					response.statusCode === 302 ||
					response.statusCode === 303 ||
					response.statusCode === 307 ||
					response.statusCode === 308
				)
			){
				if(requestData['_redirectCount'] >= 20){

					setResponseToNetworkError.call(xhr);
					handleError.call(xhr);

					return;
				}
				requestData['_redirectCount']++;

				let loc = response.headers['location'];

				let parsedURL;
				try{
					parsedURL = new URL(loc, new URL(requestData['url']).origin);
				}
				catch(e){
					// xhr.spec.open.6. If parsedURL is failure, then throw a "SyntaxError" DOMException
 					throw new DOMException(`XMLHttpRequest.open: an invalid or illegal url string was specified`, 'SyntaxError');
				}

				requestData['url'] = parsedURL.href;
				requestData['receivedBytes'] = Buffer.alloc(0);
				requestData['responseObject'] = null;
				requestData['sendFlag'] = false;
				requestData['async'] = true;

				if(
					response.statusCode >= 301                    &&
					response.statusCode <= 303                    &&
					requestData['method'].toUpperCase() !== 'GET' &&
					requestData['method'].toUpperCase() !== 'HEAD'
				){
					requestData['method'] = 'GET';
					requestData['requestBody'] = body = null;

					for(let headerCase in requestData['requestHeadersCase'])
						if(
							headerCase === 'content-type'     ||
							headerCase === 'content-length'   ||
							headerCase === 'content-encoding' ||
							headerCase === 'content-location' ||
							headerCase === 'content-language'
						){
							let header = requestData['requestHeadersCase'][headerCase];

							delete requestData['requestHeaders'][header];
							delete requestData['requestHeadersCase'][headerCase];
						}
				}

				xhr.onloadstart = null;

				xhr.upload.onloadstart = null;
				xhr.upload.onprogress  = null;
				xhr.upload.onabort     = null;
				xhr.upload.onerror     = null;
				xhr.upload.onload      = null;
				xhr.upload.ontimeout   = null;
				xhr.upload.onloadend   = null;

				xhr.send(body);

				return;
			}

			requestData['status']     =  response.statusCode;
			requestData['statusText'] =  response.statusMessage;

			// xhr.spec.11.9.4. Set this’s state to headers received.
			requestData['readyState'] = xhr.HEADERS_RECEIVED;

			// xhr.spec.11.9.5. Fire an event named readystatechange at this.
			xhr.dispatchEvent(new Event('readystatechange'));

			// xhr.spec.11.9.6. If this’s state is not headers received, then return.
			if(requestData['readyState'] !== xhr.HEADERS_RECEIVED) return;

			// xhr.spec.11.9.7. If this’s response’s body is null, then run handle response end-of-body for this and return.


			// xhr.spec.11.9.8. Let length be the result of extracting a length from this’s response’s header list.
			// xhr.spec.11.9.9. If length is not an integer, then set it to 0.
			let length = 0;

			if(response.headers['content-length'] && !isNaN(+response.headers['content-length']))
				length = +response.headers['content-length'];

			// xhr.spec.11.9.10. Let processBodyChunk given bytes be these steps:
			response.on('data', (chunk) => {

				// xhr.spec.11.9.10.1. Append bytes to this’s received bytes.
				requestData['receivedBytes'] = Buffer.concat([requestData['receivedBytes'], chunk]);

				// xhr.spec.11.9.10.2. If not roughly 50ms have passed since these steps were last invoked, then return.
				// @todo...

				// xhr.spec.11.9.10.3. If this’s state is headers received, then set this’s state to loading.
				if(requestData['readyState'] === xhr.HEADERS_RECEIVED)
					requestData['readyState'] = xhr.LOADING;

				// xhr.spec.11.9.10.4. Fire an event named readystatechange at this.
				xhr.dispatchEvent(new Event('readystatechange'));

				// xhr.spec.11.9.10.5. Fire a progress event named progress at this with this’s received bytes’s length and length.
				xhr.dispatchEvent(new ProgressEvent('progress', {loaded: requestData['receivedBytes'].length, total: length}));
			});

			// xhr.spec.11.9.11. Let processEndOfBody be this step: run handle response end-of-body for this.
			response.on('end', () => {

				// xhr.spec.11.9.11.1. Handle errors for this. // @?????
				handleError.call(xhr);

				// xhr.spec.11.9.11.2. If xhr’s response is a network error, then return. // @?????
				if(!response.statusCode) return;

				// xhr.spec.11.9.11.3. Let transmitted be xhr’s received bytes’s length.
				let transmitted = requestData['receivedBytes'].length;

				// xhr.spec.11.9.11.4. Let length be the result of extracting a length from this’s response’s header list.
				// xhr.spec.11.9.11.5. If length is not an integer, then set it to 0.
				let length = 0;

				if(response.headers['content-length'] && !isNaN(+response.headers['content-length']))
					length = +response.headers['content-length'];

				// xhr.spec.11.9.11.6. If xhr’s synchronous flag is unset, then fire a progress event named progress at xhr with transmitted and length.
				// @?????
				if(requestData['async'] && transmitted === 0)
					xhr.dispatchEvent(new ProgressEvent('progress', {loaded: transmitted, total: length}));

				// xhr.spec.11.9.11.7. Set xhr’s state to done.
				requestData['readyState'] = xhr.DONE;

				// xhr.spec.11.9.11.8. Unset xhr’s send() flag.
				requestData['sendFlag'] = false;

				// xhr.spec.11.9.11.9. Fire an event named readystatechange at xhr.
				xhr.dispatchEvent(new Event('readystatechange'));

				// xhr.spec.11.9.11.10. Fire a progress event named "load" at xhr with transmitted and length.
				xhr.dispatchEvent(new ProgressEvent('load', {loaded: transmitted, total: length}));

				// xhr.spec.11.9.11.11. Fire a progress event named loadend at xhr with transmitted and length.
				xhr.dispatchEvent(new ProgressEvent('loadend', {loaded: transmitted, total: length}));
			});

			// xhr.spec.11.9.12. Let processBodyError be these steps:
			response.on('error', (error) => {

				// xhr.spec.11.9.12.1. Set this’s response to a network error.
				setResponseToNetworkError.call(xhr);

				// xhr.spec.11.9.12.2  Run handle errors for this.
				handleError.call(xhr, error);
			});
		}; // @endof const processResponse = (response) => {  ... }

		// xhr.spec.11.10. Set this’s fetch controller to the result of fetching req ... ???????????????????????????????????????????????????
		let clientRequest = null;

		try{
			clientRequest = requestData['fetchController'] = doClientRequest(clientRequestOptions);
		}catch(err){

			// xhr.spec.11.9.12.1. Set this’s response to a network error.
			setResponseToNetworkError.call(xhr);

			// xhr.spec.11.9.12.2  Run handle errors for this.
			handleError.call(xhr, err);

			return;
		}

		clientRequest.on('close', () => {
		});

		clientRequest.on('error', (err) => {
			setResponseToNetworkError.call(xhr);
			handleError.call(xhr, err);
		});

		// xhr.spec.11.7. Note: These steps are only invoked when new bytes are transmitted.
		if(requestData['requestBody']){
			clientRequest.setHeader('Content-Length', requestData['requestBody'].length);

			(async () => {
				let buffer;

				if(requestData['requestBody'].source instanceof Blob){
					buffer = Buffer.from (await requestData['requestBody'].source.arrayBuffer());
				}
				else{
					buffer = await Promise.resolve(requestData['requestBody'].source);
				}

				clientRequest.write(buffer, processRequestBodyChunkLength); // ?????????????????????????????

				// xhr.spec.11.8. Let processRequestEndOfBody be these steps:
				clientRequest.end(processRequestEndOfBody);
			})();
		}
		else{
			clientRequest.end();
		}

		// xhr.spec.11.9. Let processResponse, given a response, be these steps:
		clientRequest.on('response', processResponse);

		// xhr.spec.11.11. Let now be the present time.
		let now = Date.now();

		// xhr.spec.11.12. Run these steps in parallel:
		// xhr.spec.11.12.1. Wait until either req’s done flag is set or this’s timeout is not 0 and this’s timeout milliseconds have passed since now.
		// xhr.spec.11.12.2. If req’s done flag is unset, then set this’s timed out flag and terminate this’s fetch controller.

		if(requestData['timeout']){
			setTimeout(() => {
				if(requestData['readyState'] !== xhr.DONE){
					requestData['timeoutFlag'] = true;
					handleError.call(xhr);
				}
			}, requestData['timeout']);
		}
	}
	// xhr.spec.12. Otherwise, if this’s synchronous flag is set:
	else
	{
		// xhr.spec.12.1. Let <processedResponse> be false.
		// xhr.spec.12.2. Let <processResponseConsumeBody>, given a <response> and <nullOrFailureOrBytes>, be these steps:
		// xhr.spec.12.2.1. If <nullOrFailureOrBytes> is not failure, then set this’s response to response.
		// xhr.spec.12.2.2. If <nullOrFailureOrBytes> is a byte sequence, then append nullOrFailureOrBytes to this’s received bytes.
		// xhr.spec.12.2.3. Set <processedResponse> to true.

		// xhr.spec.12.3. Set this’s fetch controller to the result of fetching req with <processResponseConsumeBody> set to processResponseConsumeBody
		//                and useParallelQueue set to true.
		// xhr.spec.12.4. Let now be the present time.
		// xhr.spec.12.5. Pause until either processedResponse is true or this’s timeout is not 0 and this’s timeout milliseconds have passed since now.
		// xhr.spec.12.6. If processedResponse is false, then set this’s timed out flag and terminate this’s fetch controller.
		// xhr.spec.12.7. Report timing for this’s fetch controller given the current global object.
		// xhr.spec.12.8. Run handle response end-of-body for this.

		const contentFile = '.whatwg-xhr-content-' + process.pid;
		const syncFile    = '.whatwg-xhr-sync-'    + process.pid;

		fs.writeFileSync(syncFile, '', 'utf8');

		let defaultHeadersObj = defaultHeaders();

		for(let name in defaultHeadersObj){
			if(req_headers[name] && req_headers[name] === defaultHeadersObj[name]){
				delete req_headers[name];
				delete req_headersCase[name.toLowerCase()];
			}
		}

		let headersJSON = JSON.stringify(req_headers);

		let bodyFlag = body !== null && body !== '';

const execString = `
	(async () => {
		let fs                 = await import('node:fs');
		let { XMLHttpRequest } = await import('${__filename}');

		let xhr = new XMLHttpRequest;

		let requestData = {};

		xhr.onload = () => {
			requestData['error'] = null;

			requestData['status']     = xhr.status;
			requestData['statusText'] = xhr.statusText;

			requestData['response'       ] = xhr.response;
			requestData['responseText'   ] = xhr.responseText;
			requestData['responseType'   ] = xhr.responseType;
			requestData['responseURL'    ] = xhr.responseURL;
			requestData['responseXML'    ] = xhr.responseXML;
			requestData['responseHeaders'] = xhr.getAllResponseHeaders();
		};

		xhr.onerror = (e) => {
			requestData['error'] = e;
		}

		xhr.onloadend = () => {
			fs.writeFileSync('${contentFile}', JSON.stringify(requestData, null, 2), 'utf8');
			fs.unlinkSync('${syncFile}');
		}

		xhr.open('${req_method}', '${req_url}');

		let headers = JSON.parse(process.argv[1]);
		for(let k in headers){
			xhr.setRequestHeader(k, headers[k]);
		}

		if(!${bodyFlag})
			xhr.send();

		let body = Buffer.alloc(0);

		process.stdin.on('data', (chunk) => {
			body = Buffer.concat([body, chunk]);
			xhr.send(body);
		});
	})();
`;

		let syncProc = spawn(process.argv[0], ['-e', execString, headersJSON]);

		if(bodyFlag && requestData['requestBody'].source instanceof Blob){

			const contentBlob = '.whatwg-xhr-contentBlob-' + process.pid;
			const syncBlob    = '.whatwg-xhr-syncBlob-'    + process.pid;

			fs.writeFileSync(syncBlob, '', 'utf8');

			let threadCode = `\
	const fs      = require('node:fs');
	const threads = require('node:worker_threads');

	threads.parentPort.once('message', (data) => {
		data.arrayBuffer()
			.then(arrayBuffer => Buffer.from(arrayBuffer))
			.then(buf => {
				fs.writeFileSync('${contentBlob}', buf);
				fs.unlinkSync('${syncBlob}');
			});
	});
`;

			let worker = new threads.Worker(threadCode, {eval: true});

			worker.postMessage(requestData['requestBody'].source);

			while(fs.existsSync(syncBlob));
			requestData['requestBody'].source = fs.readFileSync(contentBlob);
			fs.unlinkSync(contentBlob);

			syncProc.stdin.write(requestData['requestBody'].source);
		}
		else
		if(bodyFlag){
			syncProc.stdin.write(requestData['requestBody'].source);
		}

	syncProc.stderr.on('data', (chunk) => {
		let msg = chunk.toString();

		setResponseToNetworkError.call(xhr);
		handleError.call(xhr, new Error(msg));

		process.exit(1);
	});

		while(fs.existsSync(syncFile));
		syncProc.stdin.end();
		processResult();

		function processResult(){

			let _requestData = JSON.parse(fs.readFileSync(contentFile, 'utf8')) || {};
			fs.unlinkSync(contentFile);

			if(_requestData['status']){

				let response = {};

				requestData['status']     = response.statusCode    = _requestData['status'];
				requestData['statusText'] = response.statusMessage = _requestData['statusText'];

				requestData['responseType'] = _requestData['responseType'];
				requestData['responseURL' ] = _requestData['responseURL' ];
				requestData['responseXML' ] = _requestData['responseXML' ];

				response.url = _requestData['responseURL'];

				_requestData['responseHeaders'] = _requestData['responseHeaders'].split('\r\n');
				_requestData['responseHeaders'].pop();

				response.headers = {};
				for(let header of _requestData['responseHeaders']){
					let [name, value] = header.split('\x3A\x20');
					response.headers[name] = value;
				}

				response.rawHeaders = [];
				for(let k in response.headers){
					response.rawHeaders.push(k);
					response.rawHeaders.push(response.headers[k]);
				}

				if(_requestData['response']){
					let chunk = Buffer.from(_requestData['response']);
					requestData['receivedBytes'] = Buffer.concat([requestData['receivedBytes'], chunk]);
				}

				requestData['response'] = response;

				// xhr.spec.11.9.11.7. Set xhr’s state to done.
				requestData['readyState'] = xhr.DONE;

				// xhr.spec.11.9.11.8. Unset xhr’s send() flag.
				requestData['sendFlag'] = false;

				// xhr.spec.11.9.11.9. Fire an event named readystatechange at xhr.
				xhr.dispatchEvent(new Event('readystatechange'));

				// xhr.spec.11.9.11.10. Fire a progress event named "load" at xhr with transmitted and length.
				xhr.dispatchEvent(new ProgressEvent('load', {loaded: requestData['receivedBytes'].length, total: requestData['receivedBytes'].length}));

				// xhr.spec.11.9.11.11. Fire a progress event named loadend at xhr with transmitted and length.
				xhr.dispatchEvent(new ProgressEvent('loadend', {loaded: requestData['receivedBytes'].length, total: requestData['receivedBytes'].length}));
			}
			else{
				// xhr.spec.11.9.12.1. Set this’s response to a network error.
				setResponseToNetworkError.call(xhr);

				// xhr.spec.11.9.12.2  Run handle errors for this.
				handleError.call(xhr);
			}
		}
	}
}; // @endof method XMLHttpRequest.prototype.send

/**
 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
 * url: https://xhr.spec.whatwg.org/#the-getresponseheader()-method
 *
 * client.getResponseHeader(name)
 *   The getResponseHeader(name) method steps are to return the result of getting name from this’s response’s header list.
 *
 * @method   getResponseHeader
 * @instance
 * @memberof module:whatwg-xhr.XMLHttpRequest
 * @param    {string} name - The name of the header whose text value is required.
 * @return   {string|null} The header text value or null.
 * @desc     XMLHttpRequest method that returns the string containing the text of a particular header's value.
 */
XMLHttpRequest.prototype.getResponseHeader = function getResponseHeader(name){

	// @author: validate the number of arguments
	if(arguments.length < 1)
		throw new TypeError(`XMLHttpRequest.getResponseHeader: At least 1 argument required, but only ${arguments.length} passed`);	// firefox 102

	const requestData = xmlHttpRequest.get(this);

	if(!requestData['response']) return null;

	if(typeof name === 'symbol')
		throw new TypeError(`can't convert symbol to string`);

	let headerName = String(name).toLowerCase();
	let responseHeaders = {};

	for(let headerName in requestData['response'].headers)
		responseHeaders[headerName.toLowerCase()] = requestData['response'].headers[headerName];

	if(headerName in responseHeaders && !headerName.startsWith('set-cookie'))
		return responseHeaders[headerName];

	return null;

}; // @endof method XMLHttpRequest.prototype.getResponseHeader

/**
 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
 * url: https://xhr.spec.whatwg.org/#the-getallresponseheaders()-method
 *
 * client.getAllResponseHeaders()
 *   The getAllResponseHeaders() method steps are:
 *   1. Let <output> be an empty byte sequence.
 *   2. Let <initialHeaders> be the result of running <sort and combine> with this’s response’s header list.
 *   3. Let <headers> be the result of sorting initialHeaders in ascending order, with a being less than b if a’s name is legacy-uppercased-byte less than b’s name.
 *      Note: Unfortunately, this is needed for compatibility with deployed content.
 *   4. For each <header> in <headers>, append <header>’s name, followed by a 0x3A 0x20 byte pair, followed by <header>’s value,
 *      followed by a 0x0D 0x0A byte pair, to <output>.
 *   5. Return <output>.
 *
 * @method   getAllResponseHeaders
 * @instance
 * @memberof module:whatwg-xhr.XMLHttpRequest
 * @return   {string|null} A string representing all of the response's headers, or null if no response has been received.
 * @desc     XMLHttpRequest method that returns all the response headers, separated by CRLF, as a string, or null if no response.
 */
XMLHttpRequest.prototype.getAllResponseHeaders = function getAllResponseHeaders(){

	const requestData = xmlHttpRequest.get(this);

	if(!requestData['response']) return '';

	// xhr.spec.1. Let <output> be an empty byte sequence.
	let output = '';

	// xhr.spec.2. Let <initialHeaders> be the result of running <sort and combine>...
	let initialHeaders = requestData['response'].headers;

	// xhr.spec.3. Let <headers> be the result of sorting initialHeaders in ascending order...
	let headers = Object.entries(initialHeaders);

	headers.sort((a, b) => {
		if(a[0].toUpperCase() > b[0].toUpperCase())
			return 1;
		else
			return -1;
	});

	// xhr.spec.4. For each <header> in <headers>, append <header>’s name, followed by a 0x3A 0x20 byte pair, followed by <header>’s value,
	//             followed by a 0x0D 0x0A byte pair, to output.

	for(let header of headers){
		if(!header[0].toLowerCase().startsWith('set-cookie'))
			output += header[0] + '\x3A' + '\x20' + header[1] + '\x0D' + '\x0A';
	}
	return output;

}; // @endof method XMLHttpRequest.prototype.getAllResponseHeaders

/**
 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
 * url: https://xhr.spec.whatwg.org/#the-overridemimetype()-method
 *
 * client.overrideMimeType(mime)
 * Acts as if the `Content-Type` header value for a response is mime. (It does not change the header.)
 * Throws an "InvalidStateError" DOMException if state is loading or done.
 *
 * The overrideMimeType(mime) method steps are:
 *   1. If this’s state is loading or done, then throw an "InvalidStateError" DOMException.
 *   2. Set this’s override MIME type to the result of parsing mime.
 *   3. If this’s override MIME type is failure, then set this’s override MIME type to application/octet-stream.
 *
 * @method    overrideMimeType
 * @instance
 * @memberof  module:whatwg-xhr.XMLHttpRequest
 * @param     {string} mime - MIME type to use instead of the one specified by the server.
 * @desc      XMLHttpRequest method that specifies a MIME type other than the one provided by the server.
 * @requires  module:whatwg-misc.parseMIMEType
 * @requires  module:whatwg-misc.serializeAMimeType
 */
XMLHttpRequest.prototype.overrideMimeType = function overrideMimeType(mime){

	// @author: validate the number of arguments
	if(arguments.length < 1)
		throw new TypeError(`XMLHttpRequest.overrideMimeType: At least 1 argument required, but only 0 passed`);	// firefox 102

	const requestData = xmlHttpRequest.get(this);

	// xhr.spec.1. If this’s state is loading or done, then throw an "InvalidStateError" DOMException.
	if(requestData['readyState'] === this.LOADING || requestData['readyState'] === this.DONE)
		throw new DOMException(`XMLHttpRequest.overrideMimeType: Cannot call 'overrideMimeType()' on XMLHttpRequest after 'send()' (when its state is LOADING or DONE).`, 'InvalidStateError');	// firefox 102

	let parsedMime = parseMIMEType(String(mime));

	if(parsedMime !== 'failure'){
		// xhr.spec.2. Set this’s override MIME type to the result of parsing mime.
		requestData['overrideMimeType'] = serializeAMimeType(parsedMime);
	}
	else{
		// xhr.spec.3. If this’s override MIME type is failure, then set this’s override MIME type to application/octet-stream.
		requestData['overrideMimeType'] = 'application/octet-stream';
	}
}; // @endof method XMLHttpRequest.prototype.overrideMimeType

/**
 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
 * url: https://xhr.spec.whatwg.org/#interface-progressevent
 *
 * interface ProgressEvent : Event {
 *   constructor(DOMString type, optional ProgressEventInit eventInitDict = {});
 *
 *   readonly attribute boolean lengthComputable;
 *   readonly attribute unsigned long long loaded;
 *   readonly attribute unsigned long long total;
 * };
 *
 * dictionary ProgressEventInit : EventInit {
 *   boolean lengthComputable = false;
 *   unsigned long long loaded = 0;
 *   unsigned long long total = 0;
 * };
 *
 * @class     ProgressEvent
 * @extends   module:whatwg-xhr~Event
 * @static
 * @desc      Interface that represents events measuring progress of an underlying process, like an HTTP request for an XMLHttpRequest client.
 */
export class ProgressEvent extends Event{

	/**
 	 * @method   constructor
	 * @instance
	 * @memberof module:whatwg-xhr.ProgressEvent
	 * @param    {string} type - A case-sensitive name of the event.
	 * @param    {object} eventInitDict - (Optional) An object that, in addition to the properties defined in Event(), can have lengthComputable, loaded and total.
	 * @desc     Constructs a new ProfressEvent object.
	 */
	constructor(type, eventInitDict = {}){
		if(arguments.length < 1)
			throw new TypeError(`ProgressEvent constructor: At least 1 argument required, but only 0 passed`);	// firefox 102

		const progressEventData = {};

		progressEventData['type']             = String(type);
		progressEventData['lengthComputable'] = false;
		progressEventData['loaded']           = 0;
		progressEventData['total']            = 0;

		if(eventInitDict !== undefined && eventInitDict !== null){
			if(typeof eventInitDict !== 'object' && typeof eventInitDict !== 'function')
				throw new TypeError(`ProgressEvent constructor: Value can't be converted to a dictionary.`);	// firefox 102

			if(eventInitDict.loaded !== undefined)
				progressEventData['loaded'] = isNaN(eventInitDict.loaded) ? 0 : Number(eventInitDict.loaded);

			if(eventInitDict.total !== undefined)
				progressEventData['total'] = isNaN(eventInitDict.total) ? 0 : Number(eventInitDict.total);

			if(eventInitDict.lengthComputable !== undefined)
				progressEventData['lengthComputable'] = Boolean(eventInitDict.lengthComputable);
			else
				progressEventData['lengthComputable'] = progressEventData['total'] !== 0;

			let eventInit = {
				bubbles:    Boolean(eventInitDict['bubbles']),
				cancelable: Boolean(eventInitDict['cancelable']),
				composed:   Boolean(eventInitDict['composed'])
			};

			super(type, eventInit);
		}
		else
			super(type);

		progressEvent.set(this, progressEventData);
	}

	/**
	 * @member   {boolean} lengthComputable
	 * @memberof module:whatwg-xhr.ProgressEvent
	 * @readonly
	 * @default  false
	 * @instance
	 * @desc     A boolean value indicating if the total work to be done, and the amount of work already done, by the underlying process is calculable.
	 */
	get lengthComputable(){ return progressEvent.get(this)['lengthComputable']; }

	/**
	 * @member   {number} loaded
	 * @memberof module:whatwg-xhr.ProgressEvent
	 * @readonly
	 * @default  0
	 * @instance
	 * @desc     A number representing the amount of work already performed by the underlying process.
	 */
	get loaded(){ return progressEvent.get(this)['loaded']; }

	/**
	 * @member   {number} total
	 * @memberof module:whatwg-xhr.ProgressEvent
	 * @readonly
	 * @default  0
	 * @instance
	 * @desc     A number representing the total amount of work that the underlying process is in the progress of performing.
	 */
	get total(){ return progressEvent.get(this)['total']; }

} // @endOf class ProgressEvent extends Event

Object.defineProperty(ProgressEvent.prototype, 'lengthComputable', {enumerable: true});
Object.defineProperty(ProgressEvent.prototype, 'loaded', {enumerable: true});
Object.defineProperty(ProgressEvent.prototype, 'total', {enumerable: true});

Object.defineProperty(ProgressEvent.prototype, Symbol.toStringTag, {value: 'ProgressEvent', writable: false, enumerable: false, configurable: true});

/**
 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
 * url: https://xhr.spec.whatwg.org/#formdata
 *
 * interface FormData {
 *   constructor(optional HTMLFormElement form, optional HTMLElement? submitter = null);
 *
 *   undefined append(USVString name, USVString value);
 *   undefined append(USVString name, Blob blobValue, optional USVString filename);
 *   undefined delete(USVString name);
 *
 *   FormDataEntryValue?          get(USVString name);
 *   sequence<FormDataEntryValue> getAll(USVString name);
 *
 *   boolean   has(USVString name);
 *   undefined set(USVString name, USVString value);
 *   undefined set(USVString name, Blob blobValue, optional USVString filename);
 *
 *   iterable<USVString, FormDataEntryValue>;
 * };
 *
 * @class FormData
 * @static
 * @desc  An interface that provides a way to construct a set of key/value pairs representing form fields and their values.
 */
export class FormData{
	/**
 	 * @method   constructor
	 * @instance
	 * @memberof module:whatwg-xhr.FormData
	 * @param    {FormData}    form     - (Optional) The FormData object will be populated with the form's current keys/values.
	 * @param    {string|Blob} value    - (Optional) A submit button that is a member of the form.
	 * @desc     Constructs a new FormData object.
	 */
	constructor(form, submitter){

		if(arguments.length === 0 || !globalThis.HTMLFormElement){
			const entryList = [];
			formData.set(this, entryList);
		}
		else
		if(globalThis.HTMLFormElement){

			if(form === null || typeof form !== 'object')
				throw new TypeError('FormData constructor: Argument 1 is not an object.');

			if(!(form instanceof globalThis.HTMLFormElement))
				throw new TypeError(' FormData constructor: Argument 1 does not implement interface HTMLFormElement.');
		}
	}

	/**
 	 * @method   append
	 * @instance
	 * @memberof module:whatwg-xhr.FormData
	 * @param    {string}      name     - The name of the field whose data is contained in value.
	 * @param    {string|Blob} value    - The field's value, can be a string or Blob, otherwise the value is converted to a string.
	 * @param    {string}      filename - (Optional) The filename reported to the server (a string), when a Blob or File is passed as the second parameter.
	 * @desc     Appends a new value onto an existing key inside a FormData object, or adds the key if it does not already exist.
	 */
	append(name, value){
		// validate the arguments
		if(arguments.length < 2)
			throw new TypeError(`FormData.append: ${arguments.length} is not a valid argument count for any overload.`);

		const entryList = formData.get(this);
		const entry = {};

		entry[name] = String(value);
		entryList.push(entry);
	}

	/**
 	 * @method   delete
	 * @instance
	 * @memberof module:whatwg-xhr.FormData
	 * @param    {string} name - The name of the key to be deleted.
	 * @desc     Deletes a key and its value(s) from a FormData object.
	 */
	delete(name){
		// validate the arguments
		if(arguments.length < 1)
			throw new TypeError(`FormData.delete: At least 1 argument required, but only ${arguments.length} passed`);

		const entryList = formData.get(this);
		for(let i = 0; i < entryList.length; i++)
			if(entryList[i][name] !== undefined)
				entryList.splice(i--, 1);
	}

	/**
 	 * @method   get
	 * @instance
	 * @memberof module:whatwg-xhr.FormData
	 * @param    {string} name - The name of the key to be retrieved.
	 * @return   {string|Blob} Form data entry value.
	 * @desc     Returns the first value associated with a given key from within a FormData object.
	 */
	get(name){
		// validate the arguments
		if(arguments.length < 1)
			throw new TypeError(`FormData.delete: At least 1 argument required, but only ${arguments.length} passed`);

		const entryList = formData.get(this);
		for(let i = 0; i < entryList.length; i++)
			if(entryList[i][name] !== undefined)
				return entryList[i][name];

		return null;
	}

	/**
 	 * @method   getAll
	 * @instance
	 * @memberof module:whatwg-xhr.FormData
	 * @param    {string} name - The name of the key to be retrieved.
	 * @return   {Array} An array of values whose key matches the specified name, otherwise, an empty list.
	 * @desc     Returns all the values associated with a given key from within a FormData object.
	 */
	getAll(name){
		// validate the arguments
		if(arguments.length < 1)
			throw new TypeError(`FormData.delete: At least 1 argument required, but only ${arguments.length} passed`);

		const result = [];
		const entryList = formData.get(this);
		for(let i = 0; i < entryList.length; i++)
			if(entryList[i][name] !== undefined)
				result.push(entryList[i][name]);

		return result;
	}

	/**
 	 * @method   has
	 * @instance
	 * @memberof module:whatwg-xhr.FormData
	 * @param    {string} name - The name of the key to be retrieved.
	 * @return   {boolean} true if a key of FormData matches the specified name, otherwise, false.
	 * @desc     Returns whether a FormData object contains a certain key.
	 */
	has(name){
		// validate the arguments
		if(arguments.length < 1)
			throw new TypeError(`FormData.delete: At least 1 argument required, but only ${arguments.length} passed`);

		const entryList = formData.get(this);
		for(let i = 0; i < entryList.length; i++)
			if(entryList[i][name] !== undefined)
				return true;

		return false;
	}

	/**
 	 * @method   set
	 * @instance
	 * @memberof module:whatwg-xhr.FormData
	 * @param    {string}      name     - The name of the field whose data is contained in value.
	 * @param    {string|Blob} value    - The field's value, can be a string or Blob, otherwise the value is converted to a string.
	 * @param    {string}      filename - (Optional) The filename reported to the server (a string), when a Blob or File is passed as the second parameter.
	 * @desc     Sets a new value for an existing key inside a FormData object, or adds the key/value if it does not already exist.
	 */
	set(name, value){
		// validate the arguments
		if(arguments.length < 2)
			throw new TypeError(`FormData.append: ${arguments.length} is not a valid argument count for any overload.`);

		const entryList = formData.get(this);
		for(let i = 0; i < entryList.length; i++)
			if(entryList[i][name] !== undefined)
				entryList.splice(i, 1);

		const entry = {};

		entry[name] = String(value);
		entryList.push(entry);
	}
} // @endof class FormData

Object.defineProperty(FormData.prototype, Symbol.toStringTag, { value: 'FormData', writable: false, enumerable: false, configurable: true});
Object.defineProperty(FormData.prototype, Symbol.iterator, {
	value: function entries(){
		const entryList = formData.get(this);

		let i = 0;

		return{
			next(){
				return i < entryList.length ?
					{ value: Object.entries(entryList[i++])[0], done: false} :
					{ value: undefined, done: true};
			},

			[Symbol.iterator](){
				return this;
			}
		}
	},
	writable: false, enumerable: false, configurable: true
});

/**
 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
 * url: https://xhr.spec.whatwg.org/#handle-errors
 *
 * To handle errors for an XMLHttpRequest object xhr, run these steps:
 * 1. If xhr’s send() flag is unset, then return.
 * 2. If xhr’s timed out flag is set, then run the request error steps for xhr, "timeout", and "TimeoutError" DOMException.
 * 3. Otherwise, if xhr’s response’s aborted flag is set, run the request error steps for xhr, "abort", and "AbortError" DOMException.
 * 4. Otherwise, if xhr’s response is a network error, then run the request error steps for xhr, error, and "NetworkError" DOMException.
 *
 * @func   handleError
 * @this   module:whatwg-xhr.XMLHttpRequest
 * @param  {object} Error object.
 * @desc   Handle errors for an XMLHttpRequest object, as given by {@link https://xhr.spec.whatwg.org/#handle-errors XHR specs}.
 */
function handleError(error){

	const requestData = xmlHttpRequest.get(this);

	// xhr.spec.1. If xhr’s send() flag is unset, then return.
	if(!requestData['sendFlag']){
		return;
	}

	// xhr.spec.2. If xhr’s timed out flag is set, then run the request error steps for xhr, "timeout", and "TimeoutError" DOMException.
	if(requestData['timeoutFlag']){
		requestErrorSteps.call(this, 'timeout', new DOMException('Timeout error', 'TimeoutError'));
	}
	else
	// xhr.spec.3. If xhr’s response’s aborted flag is set, run the request error steps for xhr, "abort", and "AbortError" DOMException.
	if(requestData['response'] && requestData['_responseAbort']){
		requestErrorSteps.call(this, 'abort', new DOMException('Abort error', 'AbortError'));
	}
	else
	// xhr.spec.4. if xhr’s response is a network error, then run the request error steps for xhr, "error", and "NetworkError" DOMException.
	if(requestData['response'] === ''){
		requestErrorSteps.call(this, 'error', new DOMException('Network error', 'NetworkError'));
	}

} // @endof function handleError

/**
 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
 * url: https://xhr.spec.whatwg.org/#request-error-steps
 *
 * The request error steps for an XMLHttpRequest object <xhr>, <event>, and optionally <exception> are:
 * 1. Set <xhr>’s state to done.
 * 2. Unset <xhr>’s send() flag.
 * 3. Set <xhr>’s response to a network error.
 * 4. If <xhr>’s synchronous flag is set, then throw <exception>.
 * 5. Fire an event named readystatechange at <xhr>.
 *    Note: At this point it is clear that <xhr>’s synchronous flag is unset.
 * 6. If <xhr>’s upload complete flag is unset, then:
 *    1. Set <xhr>’s upload complete flag.
 *    2. If <xhr>’s upload listener flag is set, then:
 *       1. Fire a progress event named <event> at <xhr>’s upload object with 0 and 0.
 *       2. Fire a progress event named 'loadend' at <xhr>’s upload object with 0 and 0.
 * 7. Fire a progress event named <event> at <xhr> with 0 and 0.
 * 8. Fire a progress event named 'loadend' at <xhr> with 0 and 0.
 *
 * @func   requestErrorSteps
 * @this   module:whatwg-xhr.XMLHttpRequest
 * @param  {string} Event type
 * @param  {object|string} Exception
 * @desc   Request error steps for an XMLHttpRequest object <xhr>, <event>, and optionally <exception>, as given by {@link https://xhr.spec.whatwg.org/#request-error-steps XHR specs}.
 */
function requestErrorSteps(event, exception){

	const xhr = this;
	const requestData = xmlHttpRequest.get(xhr);

	// xhr.spec.1. Set <xhr>’s state to done.
	requestData['readyState'] = xhr.DONE;

	// xhr.spec.2. Unset <xhr>’s send() flag.
	requestData['sendFlag'] = false;

	// xhr.spec.3. Set <xhr>’s response to a network error.
	setResponseToNetworkError.call(xhr);

	// xhr.spec.4. If <xhr>’s synchronous flag is set, then throw <exception>.
	if(!requestData['async']){
		throw exception;
	}

	// xhr.spec.5. Fire an event named readystatechange at <xhr>.
	xhr.dispatchEvent(new Event('readystatechange'));

	// xhr.spec.6. If <xhr>’s upload complete flag is unset, then:
	if(!requestData['uploadCompleteFlag']){

		// xhr.spec.6.1. Set <xhr>’s upload complete flag.
		requestData['uploadCompleteFlag'] = true;

		// xhr.spec.6.2. If <xhr>’s upload listener flag is set, then:
		if(requestData['uploadListenerFlag']){
			const upload = requestData['upload'];

			// xhr.spec.6.2.1. Fire a progress event named <event> at <xhr>’s upload object with 0 and 0.
			upload.dispatchEvent(new ProgressEvent(event, {loaded: 0, total: 0}));

			// xhr.spec.6.2.2. Fire a progress event named 'loadend' at <xhr>’s upload object with 0 and 0.
			upload.dispatchEvent(new ProgressEvent('loadend', {loaded: 0, total: 0}));
		}
	}

	// xhr.spec.7. Fire a progress event named <event> at <xhr> with 0 and 0.
	xhr.dispatchEvent(new ProgressEvent(event, {loaded: 0, total: 0}));

	// xhr.spec.7. Fire a progress event named 'loadend' at <xhr> with 0 and 0.
	xhr.dispatchEvent(new ProgressEvent('loadend', {loaded: 0, total: 0}));

} // @endof function requestErrorSteps

/**
 * Fetch Living Standard — Last Updated 17 June 2024
 * url: https://fetch.spec.whatwg.org/#concept-network-error
 *
 * A network error is a response whose type is "error", status is 0, status message is the empty byte sequence, header list is « »,
 * body is null, and body info is a new response body info.
 *
 * @func   setResponseToNetworkError
 * @this   module:whatwg-xhr.XMLHttpRequest
 * @desc   Network error is a response whose type is "error", as defined by {@link https://fetch.spec.whatwg.org/#concept-network-error Fetch specs}.
 */
function setResponseToNetworkError(){

	const requestData = xmlHttpRequest.get(this);

	if(requestData['fetchController']){
		requestData['fetchController'].destroy();
		requestData['fetchController'] = null;
	}

	requestData['response'] = '';

	//	requestData['status'] = 0;
	//	requestData['statusText'] = '';

	requestData['requestHeaders'    ] = {};
	requestData['requestHeadersCase'] = {};

	requestData['receivedBytes'] = Buffer.alloc(0);
	requestData['_responseBody'] = null;

} // @endof function setResponseToNetworkError

/*
 * XMLHttpRequest Living Standard — Last Updated 20 February 2023
 * url: https://xhr.spec.whatwg.org/#response-body
 *
 * 3.6.6. Response body
 *
 * To get a response MIME type for an XMLHttpRequest object xhr, run these steps:
 *  1. Let mimeType be the result of <extracting a MIME type> from xhr’s response’s header list.
 *  2. If mimeType is failure, then set mimeType to text/xml.
 *  3. Return mimeType.
 *
 * To get a final MIME type for an XMLHttpRequest object xhr, run these steps:
 *  1. If xhr’s <override MIME type> is null, return the result of get a response MIME type for xhr.
 *  2. Return xhr’s override MIME type.
 *
 * To get a final encoding for an XMLHttpRequest object xhr, run these steps:
 *  1. Let label be null.
 *  2. Let responseMIME be the result of <get a response MIME type> for xhr.
 *  3. If responseMIME’s parameters["charset"] exists, then set label to it.
 *  4. If xhr’s override MIME type’s parameters["charset"] exists, then set label to it.
 *  5. If label is null, then return null.
 *  6. Let encoding be the result of getting an encoding from label.
 *  7. If encoding is failure, then return null.
 *  8. Return encoding.
 * The above steps intentionally do not use the get a final MIME type as it would not be web compatible.
 *
 * To set a document response for an XMLHttpRequest object xhr, run these steps:
 *  1. If xhr’s response’s body is null, then return.
 *  2. Let finalMIME be the result of get a final MIME type for xhr.
 *  3. If finalMIME is not an HTML MIME type or an XML MIME type, then return.
 *  4. If xhr’s response type is the empty string and finalMIME is an HTML MIME type, then return.
 *     Note: This is restricted to xhr’s response type being "document" in order to prevent breaking legacy content.
 *  5. If finalMIME is an HTML MIME type, then:
 *     1. Let charset be the result of get a final encoding for xhr.
 *     2. If charset is null, prescan the first 1024 bytes of xhr’s received bytes and if that does not terminate
 *        unsuccessfully then let charset be the return value.
 *     3. If charset is null, then set charset to UTF-8.
 *     4. Let document be a document that represents the result parsing xhr’s received bytes
 *        following the rules set forth in the HTML Standard for an HTML parser with scripting
 *        disabled and a known definite encoding charset. [HTML]
 *     5. Flag document as an HTML document.
 *  6. Otherwise, let document be a document that represents the result of running the XML parser
 *     with XML scripting support disabled on xhr’s received bytes.
 *     If that fails (unsupported character encoding, namespace well-formedness error, etc.),
 *     then return null. [HTML]
 *     Note: Resources referenced will not be loaded and no associated XSLT will be applied.
 *  7. If charset is null, then set charset to UTF-8.
 *  8. Set document’s encoding to charset.
 *  9. Set document’s content type to finalMIME.
 * 10. Set document’s URL to xhr’s response’s URL.
 * 11. Set document’s origin to xhr’s relevant settings object’s origin.
 * 12. Set xhr’s response object to document.
 *
 * To get a text response for an XMLHttpRequest object xhr, run these steps:
 *  1. If xhr’s response’s body is null, then return the empty string.
 *  2. Let charset be the result of get a final encoding for xhr.
 *  3. If xhr’s response type is the empty string, charset is null, and the result of get a final MIME type for xhr is an XML MIME type,
 *     then use the rules set forth in the XML specifications to determine the encoding. Let charset be the determined encoding. [XML] [XML-NAMES]
 *     This is restricted to xhr’s response type being the empty string to keep the non-legacy response type value "text" simple.
 *  4. If charset is null, then set charset to UTF-8.
 *  5. Return the result of running decode on xhr’s received bytes using fallback encoding charset.
 *  Authors are strongly encouraged to always encode their resources using UTF-8.
 */

/**
 * @func     getResponseMimeType
 * @this     module:whatwg-xhr.XMLHttpRequest
 * @return   {string} MIME type.
 * @desc     Get a response MIME type for an XMLHttpRequest object xhr, as given by {@link https://xhr.spec.whatwg.org/#response-body XHR specs}.
 * @requires module:helper-content-type.parse
 */
function getResponseMimeType(){

	const requestData = xmlHttpRequest.get(this);
	const response = requestData['response'];

	let mimeType = '';

	// xhr.spec.1. Let mimeType be the result of <extracting a MIME type> from xhr’s response’s header list.
	try{
		let obj = contentTypeParse(response.headers['content-type']);
		mimeType = response.headers['content-type'];
	}
	// xhr.spec.2. If mimeType is failure, then set mimeType to text/xml.
	catch(e){
		mimeType = 'text/xml';
	}

	// xhr.spec.3. Return mimeType.
	return mimeType;

} // @endof function getResponseMimeType

/**
 * @func   getFinalMimeType
 * @this   module:whatwg-xhr.XMLHttpRequest
 * @return {string} MIME type.
 * @desc   Get a final MIME type for an XMLHttpRequest object xhr, as given by {@link https://xhr.spec.whatwg.org/#response-body XHR specs}.
 */
function getFinalMimeType(){

	const requestData = xmlHttpRequest.get(this);

	// xhr.spec.1. If xhr’s <override MIME type> is null, return the result of get a response MIME type for xhr.
	if(requestData['overrideMimeType'] === null)
		return getResponseMimeType.call(this);

	// xhr.spec.2. Return xhr’s override MIME type.
	return requestData['overrideMimeType'];

} // @endof function getFinalMimeType

/**
 * @func   getFinalEncoding
 * @this   module:whatwg-xhr.XMLHttpRequest
 * @return {string|null} Final encoding.
 * @desc   Get a final encoding for an XMLHttpRequest object xhr, as given by {@link https://xhr.spec.whatwg.org/#response-body XHR specs}.
 * @requires module:helper-content-type.parse
 */
function getFinalEncoding(){

	const requestData = xmlHttpRequest.get(this);

	// xhr.spec.1. Let label be null.
	let label = null;

	// xhr.spec.2. Let responseMIME be the result of <get a response MIME type> for xhr.
	let responseMIME = getResponseMimeType.call(this);

	let obj = null;
	// xhr.spec.3. If responseMIME’s parameters["charset"] exists, then set label to it.
	try{
		obj = contentTypeParse(responseMIME);
		if(obj.parameters && obj.parameters.charset)
			label = obj.parameters.charset;
	}catch(e){}

	// xhr.spec.4. If xhr’s override MIME type’s parameters["charset"] exists, then set label to it.
	if(requestData['overrideMimeType']){
		try{
			obj = contentTypeParse(requestData['overrideMimeType']);
			if(obj.parameters && obj.parameters.charset)
				label = obj.parameters.charset;
		}catch(e){}
	}

	// xhr.spec.5. If label is null, then return null.
	if(label === null) return null;

	// xhr.spec.6. Let encoding be the result of getting an encoding from label.
	let encoding = whatwgEncoding.labelToName(label);

	// xhr.spec.7. If encoding is failure, then return null.
	// xhr.spec.8. Return encoding.
	return encoding;

} // @endof function getFinalEncoding

/**
 * @func     setDocumentResponse
 * @this     module:whatwg-xhr.XMLHttpRequest
 * @desc     Set a document response for an XMLHttpRequest object xhr, as given by {@link https://xhr.spec.whatwg.org/#response-body XHR specs}.
 * @requires module:helper-content-type.parse
 */
function setDocumentResponse(){

	const requestData = xmlHttpRequest.get(this);

	// xhr.spec.1. If xhr’s response’s body is null, then return.
	if(requestData['receivedBytes'].length === 0) return;

	// xhr.spec.2. Let <finalMIME> be the result of get a final MIME type for xhr.
	let finalMIME = getFinalMimeType.call(this);
	let obj;

	try{
		obj = contentTypeParse(finalMIME);

		// xhr.spec.3. If <finalMIME> is not an HTML MIME type or an XML MIME type, then return.
		if(
			obj.type !== 'text/xml'        &&
			obj.type !== 'application/xml' &&
			!obj.type.endsWith('+xml')     &&
			obj.type !== 'text/html'
		)
			return;

		// xhr.spec.4. If xhr’s response type is the empty string and <finalMIME> is an HTML MIME type, then return.
		if(obj.type === 'text/html' && this.responseType === '')
			return;

		// xhr.spec.5. If finalMIME is an HTML MIME type, then:
		if(obj.type === 'text/html'){

			// xhr.spec.5.1. Let <charset> be the result of get a final encoding for xhr.
			let charset = getFinalEncoding.call(this);

			// xhr.spec.5.2. If <charset> is null, prescan the first 1024 bytes of xhr’s received bytes and if that does not terminate
			//               unsuccessfully then let <charset> be the return value.
			if(charset === null){
				charset = htmlEncodingSniffer(requestData['receivedBytes'].subarray(0, 1024));
			}

			// xhr.spec.5.3. If <charset> is null, then set <charset> to UTF-8.
			if(charset === null) charset = 'UTF-8';

			// xhr.spec.5.4. Let <document> be a document that represents the result parsing xhr’s received bytes
			//               following the rules set forth in the HTML Standard for an HTML parser with scripting
			//               disabled and a known definite encoding charset. [HTML]
			// xhr.spec.5.5. Flag document as an HTML document.

			// @todo...
		}
		else{
			// xhr.spec.6. Otherwise, let document be a document that represents the result of running the XML parser
			//             with XML scripting support disabled on xhr’s received bytes.
			//             If that fails (unsupported character encoding, namespace well-formedness error, etc.),
			//             then return null. [HTML]
			// Note: Resources referenced will not be loaded and no associated XSLT will be applied.

			// @todo...
		}
	}catch(e){
		return;
	}

	// xhr.spec.7. If charset is null, then set charset to UTF-8.
	// xhr.spec.8. Set document’s encoding to charset.
	// xhr.spec.9. Set document’s content type to finalMIME.
	// xhr.spec.10. Set document’s URL to xhr’s response’s URL.
	// xhr.spec.11. Set document’s origin to xhr’s relevant settings object’s origin.

	// @todo...

	// xhr.spec.12. Set xhr’s response object to document.
	requestData['responseObject'] = null;

} // @endof function setDocumentResponse

/**
 * @func     getTextResponse
 * @this     module:whatwg-xhr.XMLHttpRequest
 * @return   {string} Text response.
 * @desc     Get a text for an XMLHttpRequest object xhr, as given by {@link https://xhr.spec.whatwg.org/#response-body XHR specs}.
 * @requires module:helper-content-type.parse
 * @requires module:helper-xml-encoding-sniffer.xmlEncodingSniffer
 */
function getTextResponse(){

	const requestData = xmlHttpRequest.get(this);

	// xhr.spec.1. If xhr’s response’s body is null, then return the empty string.
	// author. if(requestData['_responseBody'] === null)
	if(requestData['receivedBytes'].length === 0){
		return '';
	}

	// xhr.spec.2. Let charset be the result of get a final encoding for xhr.
	let charset = getFinalEncoding.call(this);

	// xhr.spec.3. If xhr’s response type is the empty string, charset is null, and the result of get a final MIME type for xhr is an XML MIME type,
	//             then use the rules set forth in the XML specifications to determine the encoding. Let charset be the determined encoding. [XML] [XML-NAMES]
	//             This is restricted to xhr’s response type being the empty string to keep the non-legacy response type value "text" simple.
	if(requestData['responseType'] === '' && charset === null){
		let finalMimeType = getFinalMimeType.call(this);
		try{
			let obj = contentTypeParse(finalMimeType);
			if(obj.type === 'text/xml' || obj.type === 'application/xml' || obj.type.endsWith('+xml')){
				// @todo: use the rules set forth in the XML specifications to determine the encoding. Let charset be the determined encoding.
				charset = xmlEncodingSniffer(requestData['receivedBytes']);
			}
		}catch(e){}
	}

	// xhr.spec.4. If charset is null, then set charset to UTF-8.
	if(charset === null) charset = 'UTF-8';

	// xhr.spec.5. Return the result of running decode on xhr’s received bytes using fallback encoding charset.
	return whatwgEncoding.decode(requestData['receivedBytes'], charset);

} // @endof function getTextResponse

/**
 * @class ClientRequestData
 * @desc Emulates the node http.ClientRequest for processing data url's.
 */
class ClientRequestData{

	/**
 	 * @method   constructor
	 * @instance
	 * @memberof module:whatwg-xhr~ClientRequestData
	 * @param    {object} response - Emulates the http.IncomingMessage object.
	 * @return   {object} ClientRequestData object.
	 * @desc     Constructs a new ClientRequestData object.
	 */
	constructor(response){
		this.response = response;
	}

	/**
 	 * @method   destroy
	 * @instance
	 * @memberof module:whatwg-xhr~ClientRequestData
	 * @return   {object} ClientRequestData object.
	 * @desc     Emulates the node http.ClientRequest destroy() method.
	 */
	destroy(){
		return this;
	}

	/**
 	 * @method   end
	 * @instance
	 * @memberof module:whatwg-xhr~ClientRequestData
	 * @param    {function} callback - Callback function to invoke.
	 * @return   {object} ClientRequestData object.
	 * @desc     Emulates the node http.ClientRequest end() method.
	 */
	end(callback){
		if(typeof callback === 'function')
			callback();

		return this;
	}

	/**
 	 * @method   on
	 * @instance
	 * @memberof module:whatwg-xhr~ClientRequestData
	 * @param    {string} type - The event to invoke.
	 * @param    {function} callback - Callback function to invoke.
	 * @return   {object} ClientRequestData object.
	 * @desc     Emulates the node http.ClientRequest on() method.
	 */
	on(type, callback){
		if(type === 'response' && typeof callback === 'function')
			callback(this.response);
		else
		if(type === 'error' && typeof callback === 'function' && this.response.statusCode === 0)
			callback(new ProgressEvent('error'));

		return this;
	}
} // @endof class ClientRequestData

/**
 * @func     requestDataURL
 * @param    {object} options - Options passed to the node http.request function.
 * @return   {object} ClientRequestData object.
 * @desc     Emulates the node http.request function for processing data url's.
 * @requires module:whatwg-misc.dataURLProcessor
 * @requires module:whatwg-misc.serializeAMimeType
 */
function requestDataURL(options){

	let urlStruct = null;
	let responseDataURL = null;

	try{
		urlStruct = dataURLProcessor(new URL(options.url));
	}catch(e){
		urlStruct = 'failure';
	}

	if(urlStruct !== 'failure'){

		if(options.method.toUpperCase() === 'HEAD')
			responseDataURL = Readable.from(Buffer.alloc(0));
		else
			responseDataURL = Readable.from(Buffer.from(urlStruct.body));

		responseDataURL.statusCode = 200;
		responseDataURL.statusMessage = 'OK';
		responseDataURL.url = options.url;

		responseDataURL.headers = {
			'Content-Type': serializeAMimeType(urlStruct.mimeType),
		}
	}
	else{
		responseDataURL = Readable.from(Buffer.alloc(0));

		responseDataURL.statusCode = 0;
		responseDataURL.statusMessage = '';

		responseDataURL.headers = {};
	}

	return new ClientRequestData(responseDataURL);

} // @endof function requestDataURL
