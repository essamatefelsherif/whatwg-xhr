/*
 * W3C Extensible Markup Language (XML) 1.0 (Fifth Edition)
 * W3C Recommendation 26 November 2008
 * url: https://www.w3.org/TR/xml/#charencoding
 *
 * function xmlEncodingSniffer(sample)
 * function getXmlDeclaredEncoding(sample,  guessedEncoding)
 * function getStringFromByteArray(message, guessedEncoding)
 * function detectUnicodeInByteSampleByHeuristics(sampleBytes)
 * function detectSuspiciousUTF8SequenceLength(sampleBytes, currentPos)
 * function detectBOMBytes(bomBytes)
 * function isCommonUSASCIIByte(byte)
 *
 * xmlEncodingSniffer                    => detectBOMBytes, getXmlDeclaredEncoding
 * getXmlDeclaredEncoding                => getStringFromByteArray
 * getStringFromByteArray                => detectBOMBytes, detectUnicodeInByteSampleByHeuristics
 * detectUnicodeInByteSampleByHeuristics => detectSuspiciousUTF8SequenceLength
 * detectSuspiciousUTF8SequenceLength    => NULL
 * detectBOMBytes                        => NULL
 * isCommonUSASCIIByte(byte)             => NULL
 *
 * @module  helper-xml-encoding-sniffer
 * @desc    Helper module - Helper functions for the main module {@link module:whatwg-xhr whatwg-xhr}.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/*
 * @func    xmlEncodingSniffer
 * @static
 * @param   {object} Sample Buffer data.
 * @return  {string} Encoding detected.
 * @desc    Auto-detection of character encoding of XML data.
 */
function xmlEncodingSniffer(sample){

	let encodingFound1 = null;
	let encodingFound2 = null;

	// look for the BOM in the read sample
	encodingFound1 = detectBOMBytes(sample);

	// if the encoding was not detected due to a missing or unrecognizable BOM,
	// try to detect from the binary representation of the string "<?xml"
	let checkPseudoAttribute = false;

	if(encodingFound1 === null){

		if(sample[0] === 0x00 && sample[1] === 0x3C && sample[2] === 0x00 && sample[3] === 0x3F){

			// UTF-16BE or big-endian ISO-10646-UCS-2 or other encoding with a 16-bit code unit
			// in big-endian order and ASCII characters encoded as ASCII values.
			// (the encoding declaration must be read to determine which)

			encodingFound1 = 'UTF-16BE';
			checkPseudoAttribute = true;
		}
		else
		if(sample[0] === 0x00 && sample[1] === 0x00 && sample[2] === 0x00 && sample[3] === 0x3C){

			// UTF-32BE
			// (the encoding declaration must be read to determine which)

			encodingFound1 = 'UTF-32BE';
			checkPseudoAttribute = true;
		}
		else
		if(sample[0] === 0xFF && sample[1] === 0xFE){

			encodingFound1 = 'UTF-16LE';
		}
		else
		if(sample[0] === 0xFE && sample[1] === 0xFF){

			encodingFound1 = 'UTF-16BE';
		}
		else
		if(sample[0] === 0x3C && sample[1] === 0x00 && sample[2] === 0x00 && sample[3] === 0x00){

			// (the encoding declaration must be read to determine which)

			encodingFound1 = 'UTF-32';
			checkPseudoAttribute = true;
		}
		else
		if(sample[0] === 0x3C && sample[1] === 0x00 && sample[2] === 0x3F && sample[3] === 0x00){

			// UTF-16LE or little-endian ISO-10646-UCS-2 or other encoding with a 16-bit code unit
			// in little-endian order and ASCII characters encoded as ASCII values
			// (the encoding declaration must be read to determine which)

			encodingFound1 = 'UTF-16LE';
			checkPseudoAttribute = true;
		}
		else
		if(sample[0] === 0x3C && sample[1] === 0x3F && sample[2] === 0x78 && sample[3] === 0x6D){

			// UTF-8, ISO 646, ASCII, some part of ISO 8859 or any other 7-bit, 8-bit
			// (the encoding declaration must be read to determine which)

			encodingFound1 = 'ASCII';
			checkPseudoAttribute = true;
		}
		else
		if(sample[0] === 0x4C && sample[1] === 0x6F && sample[2] === 0xA7 && sample[3] === 0x94){

		    // IBM037 - IBM EBCDIC US-Canada"CP037";

			encodingFound1 = 'IBM037';
		}
	}	// if (encodingFound1 === null)

	// Now read the encoding pseudoattribute in the XML header, if present
	encodingFound2 = getXmlDeclaredEncoding(sample, encodingFound1 || 'UTF-8');

	// when not declared, w3c says it is utf-8
	if(encodingFound2 === null)
		encodingFound2 = 'UTF-8';

	// compare the 2 found encoding and decided which is the right one

	let winner = null;
	if(encodingFound1 === encodingFound2){
		winner = encodingFound2;
	}
	else
	if(encodingFound1 === null){
		winner = encodingFound2;
	}
	else
	if(encodingFound2 === null){
		winner = encodingFound1;
	}
	else
	if(checkPseudoAttribute){
		// Fine-tune the winner encoding. This is the most heuristic part, as some encoding
		// can be overloaded. E.g. ASCII might be UTF-7, UTF-8, ISO-8859...

		if(
			(encodingFound1 === 'ASCII') &&
			(encodingFound2 === 'UTF-7' || encodingFound2 === 'UTF-8' || encodingFound2.toUpperCase().includes('ISO-8859'))
		){
			winner = encodingFound2;
		}
		else{
			// I'm not sure here if throw an exception or accept encodingFound1 or encodingFound2,
			// as both are not null and not equals
			// throw new Error(
			//	`The text encoding and the encoding pseudo-attribute of the XML header mismatch ${encodingFound1} ${encodingFound2}`);

			winner = encodingFound2;
		}
	}
	else{
			// encodingFound1 and encodingFound2 are different so none win
			// throw new Error(
			//	`The text encoding and the encoding pseudo-attribute of the XML header mismatch ${encodingFound1} ${encodingFound2}`);

			winner = encodingFound2;
	}

	// return the detected encoding
	return winner;
}

function getXmlDeclaredEncoding(sample, guessedEncoding){

	// capture the encoding from the xml declaraion
	let contents = getStringFromByteArray(sample, guessedEncoding);

	let pattern = /<\?xml\s+version\=["']1\.0["']\s+encoding\=["'](?<encoding>[\w\-]+)["']/;

	let m = contents.match(pattern);

	return m && m.groups['encoding'];
}

function getStringFromByteArray(message, guessedEncoding){

	// try to get the encoding from the byte array
	let encodingFound = detectBOMBytes(message);

	if(encodingFound){
		let preamble;

		switch(encodingFound){
			case 'UTF-16LE':
			case 'UTF-16LE':
				preamble = 2;
				break;
			case 'UTF-7':
			case 'UTF-8':
				preamble = 3;
				break;
			case 'UTF-32LE':
			case 'UTF-32BE':
				preamble = 4;
				break;
			default:
				preamble = 0;
		}

		let decoder = new TextDecoder(encodingFound);

		return new TextDecoder(encodingFound).decode(message.subarray(preamble));
	}

	encodingFound = detectUnicodeInByteSampleByHeuristics(message) || guessedEncoding;

	return new TextDecoder(encodingFound).decode( new Uint8Array(message).buffer );
}

function detectUnicodeInByteSampleByHeuristics(sampleBytes){

	let oddBinaryNullsInSample      = 0;
	let evenBinaryNullsInSample     = 0;

	let suspiciousUTF8SequenceCount = 0;
	let suspiciousUTF8BytesTotal    = 0;

	let likelyUSASCIIBytesInSample  = 0;

	// Cycle through, keeping count of binary null positions, possible UTF-8
	// sequences from upper ranges of Windows-1252, and probable US-ASCII
	// character counts.

	let currentPos    = 0;
	let skipUTF8Bytes = 0;

	while(currentPos < sampleBytes.length){

		//binary null distribution
		if(sampleBytes[currentPos] === 0){
			if(currentPos % 2 === 0)
				evenBinaryNullsInSample++;
			else
				oddBinaryNullsInSample++;
		}

		//likely US-ASCII characters
		if(isCommonUSASCIIByte(sampleBytes[currentPos])){
			likelyUSASCIIBytesInSample++;
		}

		//suspicious sequences (look like UTF-8)
		if(skipUTF8Bytes === 0){

			let lengthFound = detectSuspiciousUTF8SequenceLength(sampleBytes, currentPos);

			if(lengthFound > 0){

				suspiciousUTF8SequenceCount++;
				suspiciousUTF8BytesTotal += lengthFound;
				skipUTF8Bytes = lengthFound - 1;
			}
		}
		else{
			skipUTF8Bytes--;
		}

		currentPos++;
	}

	// UTF-16 LE - in english / european environments, this is usually characterized by a
	// high proportion of odd binary nulls (starting at 0), with (as this is text) a low
	// proportion of even binary nulls.
	// The thresholds here used (less than 20% nulls where you expect non-nulls, and more than
	// 60% nulls where you do expect nulls) are completely arbitrary.

	if(
		((evenBinaryNullsInSample * 2.0) / sampleBytes.length) < 0.2 &&
		((oddBinaryNullsInSample * 2.0)  / sampleBytes.length) > 0.6
	)
		return 'UTF-16LE';

	// UTF-16 BE - in english / european environments, this is usually characterized by a
	// high proportion of even binary nulls (starting at 0), with (as this is text) a low
	// proportion of odd binary nulls.
	// The thresholds here used (less than 20% nulls where you expect non-nulls, and more than
	// 60% nulls where you do expect nulls) are completely arbitrary.

	if(
		((oddBinaryNullsInSample * 2.0) / sampleBytes.length)  < 0.2 &&
		((evenBinaryNullsInSample * 2.0) / sampleBytes.length) > 0.6
	)
		return 'UTF-16BE';

	// UTF-8 - Martin Dürst outlines a method for detecting whether something CAN be UTF-8 content
	// using regexp, in his w3c.org unicode FAQ entry:
	// http://www.w3.org/International/questions/qa-forms-utf-8

	let potentiallyMangledString = sampleBytes.toString('ascii');

	let utf8Validator = '';

	utf8Validator += '^(';
	utf8Validator += '[\\x00-\\x7F]';                            // ASCII
	utf8Validator += '|[\\xC2-\\xDF][\\x80-\\xBF]';              // non-overlong 2-byte
	utf8Validator += '|\\xE0[\\xA0-\\xBF][\\x80-\\xBF]';         // excluding overlongs
	utf8Validator += '|[\\xE1-\\xEC\\xEE\\xEF][\\x80-\\xBF]{2}'; // straight 3-byte
	utf8Validator += '|\\xED[\\x80-\\x9F][\\x80-\\xBF]';         // excluding surrogates
	utf8Validator += '|\\xF0[\\x90-\\xBF][\\x80-\\xBF]{2}';      // planes 1-3
	utf8Validator += '|[\\xF1-\\xF3][\\x80-\\xBF]{3}';           // planes 4-15
	utf8Validator += '|\\xF4[\\x80-\\x8F][\\x80-\\xBF]{2}';      // plane 16
	utf8Validator += ')*$';

	utf8Validator = new RegExp(utf8Validator);

	if(utf8Validator.test(potentiallyMangledString)){

		// Unfortunately, just the fact that it CAN be UTF-8 doesn't tell you much about probabilities.
		// If all the characters are in the 0-127 range, no harm done, most western charsets are same
		// as UTF-8 in these ranges.
		// If some of the characters were in the upper range (western accented characters), however,
		// they would likely be mangled to 2-byte by the UTF-8 encoding process.
		// So, we need to play stats.

		// The "Random" likelihood of any pair of randomly generated characters being one
		// of these "suspicious" character sequences is:
		// 128 / (256 * 256) = 0.2%.
		//
		// In western text data, that is SIGNIFICANTLY reduced - most text data stays in the <127
		// character range, so we assume that more than 1 in 500,000 of these character
		// sequences indicates UTF-8. The number 500,000 is completely arbitrary - so sue me.
		//
		// We can only assume these character sequences will be rare if we ALSO assume that this
		// IS in fact western text - in which case the bulk of the UTF-8 encoded data (that is
		// not already suspicious sequences) should be plain US-ASCII bytes. This, I
		// arbitrarily decided, should be 80% (a random distribution, eg binary data, would yield
		// approx 40%, so the chances of hitting this threshold by accident in random data are
		// VERY low).

		if
			(
				(suspiciousUTF8SequenceCount * 500000.0 / sampleBytes.length >= 1) && //suspicious sequences
				( //all suspicious, so cannot evaluate proportion of US-Ascii
				    (sampleBytes.length - suspiciousUTF8BytesTotal === 0) ||
					likelyUSASCIIBytesInSample * 1.0 / (sampleBytes.length - suspiciousUTF8BytesTotal) >= 0.8
				)
		)
			return 'UTF-8';
	}

	return null;
}

function detectSuspiciousUTF8SequenceLength(sampleBytes, currentPos){

	let lengthFound = 0;

		if(
			sampleBytes.length >= currentPos + 1 &&
			sampleBytes[currentPos] === 0xC2
		){
			if(
				sampleBytes[currentPos + 1] === 0x81 ||
				sampleBytes[currentPos + 1] === 0x8D ||
				sampleBytes[currentPos + 1] === 0x8F
			)
				lengthFound = 2;
			else
			if(
				sampleBytes[currentPos + 1] === 0x90 ||
				sampleBytes[currentPos + 1] === 0x9D
			)
				lengthFound = 2;
			else
			if(
				sampleBytes[currentPos + 1] >= 0xA0 &&
				sampleBytes[currentPos + 1] <= 0xBF
			)
				lengthFound = 2;
		}
		else
		if(
			sampleBytes.length >= currentPos + 1 &&
			sampleBytes[currentPos] === 0xC3
		){
			if(
				sampleBytes[currentPos + 1] >= 0x80 &&
				sampleBytes[currentPos + 1] <= 0xBF
			)
				lengthFound = 2;
		}
		else
		if(
			sampleBytes.length >= currentPos + 1 &&
			sampleBytes[currentPos] === 0xC5
		){
			if(
				sampleBytes[currentPos + 1] === 0x92 ||
				sampleBytes[currentPos + 1] === 0x93
			)
				lengthFound = 2;
			else
			if(
				sampleBytes[currentPos + 1] === 0xA0 ||
				sampleBytes[currentPos + 1] === 0xA1
			)
				lengthFound = 2;
			else
			if(
				sampleBytes[currentPos + 1] === 0xB8 ||
				sampleBytes[currentPos + 1] === 0xBD ||
				sampleBytes[currentPos + 1] === 0xBE
			)
				lengthFound = 2;
		}
		else
		if(
			sampleBytes.length >= currentPos + 1 &&
			sampleBytes[currentPos] === 0xC6
		){
			if(sampleBytes[currentPos + 1] === 0x92)
				lengthFound = 2;
		}
		else
		if(
			sampleBytes.length >= currentPos + 1 &&
			sampleBytes[currentPos] === 0xCB
		){
			if(
				sampleBytes[currentPos + 1] === 0x86 ||
				sampleBytes[currentPos + 1] === 0x9C
			)
				lengthFound = 2;
		}
		else
		if(
			sampleBytes.length >= currentPos + 2 &&
			sampleBytes[currentPos] === 0xE2
		){
			if(sampleBytes[currentPos + 1] === 0x80){
				if(
					sampleBytes[currentPos + 2] === 0x93 ||
					sampleBytes[currentPos + 2] === 0x94
				)
					lengthFound = 3;

				if(
					sampleBytes[currentPos + 2] === 0x98 ||
					sampleBytes[currentPos + 2] === 0x99 ||
					sampleBytes[currentPos + 2] === 0x9A
				)
					lengthFound = 3;

				if(
					sampleBytes[currentPos + 2] === 0x9C ||
					sampleBytes[currentPos + 2] === 0x9D ||
					sampleBytes[currentPos + 2] === 0x9E
				)
					lengthFound = 3;

				if(
					sampleBytes[currentPos + 2] === 0xA0 ||
					sampleBytes[currentPos + 2] === 0xA1 ||
					sampleBytes[currentPos + 2] === 0xA2
				)
					lengthFound = 3;

				if(sampleBytes[currentPos + 2] === 0xA6)
					lengthFound = 3;

				if(sampleBytes[currentPos + 2] === 0xB0)
					lengthFound = 3;

				if(
					sampleBytes[currentPos + 2] === 0xB9 ||
					sampleBytes[currentPos + 2] === 0xBA
				)
					lengthFound = 3;
			}
			else
			if(
				sampleBytes[currentPos + 1] === 0x82 &&
				sampleBytes[currentPos + 2] === 0xAC
			)
				lengthFound = 3;
			else
			if(
				sampleBytes[currentPos + 1] === 0x84 &&
				sampleBytes[currentPos + 2] === 0xA2
			)
				lengthFound = 3;
		}

	return lengthFound;
}

function detectBOMBytes(bomBytes){

	if (bomBytes.length < 2) return null;

	// UTF-16LE - Unicode UTF-16 little endian byte order
	if (
		bomBytes[0] === 0xFF &&
		bomBytes[1] === 0xFE &&
		(bomBytes.length < 4 || bomBytes[2] != 0x00 || bomBytes[3] != 0x00)
	)
		return 'UTF-16LE';

	// UTF-16BE - Unicode UTF-16 big endian byte order
	if (bomBytes[0] === 0xFE && bomBytes[1] === 0xFF)
		return 'UTF-16BE';

	if (bomBytes.length < 3) return null;

	// UTF-8
	if (bomBytes[0] === 0xEF && bomBytes[1] === 0xBB && bomBytes[2] === 0xBF)
		return 'UTF-8';

	// Character encodings such as UTF-7 that make overloaded usage of ASCII-valued
	// bytes may fail to be reliably detected
	if (bomBytes[0] === 0x2B && bomBytes[1] === 0x2F && bomBytes[2] === 0x76)
		return 'UTF-7';

	if (bomBytes.length < 4) return null;

	// UTF-32LE - Unicode UTF-32 little endian byte order
	if (bomBytes[0] === 0xFF && bomBytes[1] === 0xFE && bomBytes[2] === 0x00 && bomBytes[3] === 0x00)
		return 'UTF-32LE';

	// UTF-32BE - Unicode UTF-32 big endian byte order
	if (bomBytes[0] === 0x00 && bomBytes[1] === 0x00 && bomBytes[2] === 0xFE && bomBytes[3] === 0xFF)
		return 'UTF-32BE';

	return null;
}

function isCommonUSASCIIByte(byte){
	return (
		byte === 0x0A || //lf
		byte === 0x0D || //cr
		byte === 0x09 || //tab
		(byte >= 0x20 && byte <= 0x2F) || //common punctuation
		(byte >= 0x30 && byte <= 0x39) || //digits
		(byte >= 0x3A && byte <= 0x40) || //common punctuation
		(byte >= 0x41 && byte <= 0x5A) || //capital letters
		(byte >= 0x5B && byte <= 0x60) || //common punctuation
		(byte >= 0x61 && byte <= 0x7A) || //lowercase letters
		(byte >= 0x7B && byte <= 0x7E)    //common punctuation
	);
}

module.exports.xmlEncodingSniffer = xmlEncodingSniffer;
