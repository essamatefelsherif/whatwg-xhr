/**
 * @module  file-polyfill
 * @desc    A Node.js implementation of the {@link https://w3c.github.io/FileAPI/#file-section W3C File API} specifications for non-browser environments.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/**
 * Global object available in all node modules >= v14.18.0
 *
 * Blob Added in: node v14.18.0
 *
 * @external Blob
 * @desc Global object available in all node modules >= v14.18.0, defined by {@link https://w3c.github.io/FileAPI/#blob-section W3C File API Standard} and implemented by {@link https://nodejs.org/docs/latest-v20.x/api/buffer.html#class-blob node.js}
 */

/**
 * W3C File API specifications
 * url: https://w3c.github.io/FileAPI/#file-section
 *
 * [Exposed=(Window,Worker), Serializable]
 * interface File : Blob {
 *   constructor(sequence<BlobPart> fileBits,
 *               USVString fileName,
 *               optional FilePropertyBag options = {});
 *   readonly attribute DOMString name;
 *   readonly attribute long long lastModified;
 * };
 *
 * dictionary FilePropertyBag : BlobPropertyBag {
 *   long long lastModified;
 * };
 *
 * @class   File
 * @extends module:file-polyfill~Blob
 * @static
 * @desc   The File interface provides information about files and allows JavaScript in a web page to access their content.
 */
export class File extends Blob{
	/** @member {string} */
	#name;
	/** @member {number} */
	#lastModified;

	/**
	 * @method   constructor
	 * @instance
	 * @memberof module:file-polyfill.File
	 * @param    {object} fileBits - An iterable object that will be put inside the File.
	 * @param    {string} fileName - A string representing the file name or the path to the file.
	 * @param    {object} options - An options object containing optional attributes for the file.
	 * @desc     Constructs a new File object.
	 */
	constructor(fileBits, fileName, options = {}){

		if(globalThis.window){
			/** node:coverage disable **

			if(arguments.length < 2){
				throw new TypeError(`File constructor: At least 2 arguments required, but only ${arguments.length} passed`);  // firefox 102
			}

			*** node:coverage enable ***/
		}
		else{
			if(arguments.length < 2){
				throw new TypeError(`File constructor: The "fileBits" and "fileName" arguments must be specified`);	// node.js
			}
		}

		super(fileBits, options);

		let { lastModified } = options === null ? {} : options;

		if(lastModified !== undefined){
			// Using Number(...) will not throw an error for bigints.
			lastModified = +lastModified;

			if(Number.isNaN(lastModified)) lastModified = 0;
		}
		else{
			lastModified = Date.now();
		}

		this.#name = String(fileName);
		this.#lastModified = lastModified;
	}

	/**
	 * @member   {function} name
	 * @memberof module:file-polyfill.File
	 * @instance
	 * @readonly
	 * @desc     Get the name of the file represented by a File object.
	 */
	get name() { return this.#name }

	/**
	 * @member   {function} lastModified
	 * @memberof module:file-polyfill.File
	 * @instance
	 * @readonly
	 * @desc     Get the last modified date of the file as the number of milliseconds since the Unix epoch.
	 */
	get lastModified() { return this.#lastModified }
}

Object.defineProperty(File.prototype, Symbol.toStringTag, {value: 'File', configurable: true});
