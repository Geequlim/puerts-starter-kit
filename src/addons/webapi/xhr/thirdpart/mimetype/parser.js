// Copyright © 2017–2018 Domenic Denicola <d@domenic.me>
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import {
	removeLeadingAndTrailingHTTPWhitespace,
	removeTrailingHTTPWhitespace,
	isHTTPWhitespaceChar,
	solelyContainsHTTPTokenCodePoints,
	soleyContainsHTTPQuotedStringTokenCodePoints,
	asciiLowercase,
	collectAnHTTPQuotedString
} from "./utils.js";

export default input => {
	input = removeLeadingAndTrailingHTTPWhitespace(input);

	let position = 0;
	let type = "";
	while (position < input.length && input[position] !== "/") {
		type += input[position];
		++position;
	}

	if (type.length === 0 || !solelyContainsHTTPTokenCodePoints(type)) {
		return null;
	}

	if (position >= input.length) {
		return null;
	}

	// Skips past "/"
	++position;

	let subtype = "";
	while (position < input.length && input[position] !== ";") {
		subtype += input[position];
		++position;
	}

	subtype = removeTrailingHTTPWhitespace(subtype);

	if (subtype.length === 0 || !solelyContainsHTTPTokenCodePoints(subtype)) {
		return null;
	}

	const mimeType = {
		type: asciiLowercase(type),
		subtype: asciiLowercase(subtype),
		parameters: new Map()
	};

	while (position < input.length) {
		// Skip past ";"
		++position;

		while (isHTTPWhitespaceChar(input[position])) {
			++position;
		}

		let parameterName = "";
		while (position < input.length && input[position] !== ";" && input[position] !== "=") {
			parameterName += input[position];
			++position;
		}
		parameterName = asciiLowercase(parameterName);

		if (position < input.length) {
			if (input[position] === ";") {
				continue;
			}

			// Skip past "="
			++position;
		}

		let parameterValue = null;
		if (input[position] === "\"") {
			[parameterValue, position] = collectAnHTTPQuotedString(input, position);

			while (position < input.length && input[position] !== ";") {
				++position;
			}
		} else {
			parameterValue = "";
			while (position < input.length && input[position] !== ";") {
				parameterValue += input[position];
				++position;
			}

			parameterValue = removeTrailingHTTPWhitespace(parameterValue);

			if (parameterValue === "") {
				continue;
			}
		}

		if (parameterName.length > 0 &&
			solelyContainsHTTPTokenCodePoints(parameterName) &&
			soleyContainsHTTPQuotedStringTokenCodePoints(parameterValue) &&
			!mimeType.parameters.has(parameterName)) {
			mimeType.parameters.set(parameterName, parameterValue);
		}
	}

	return mimeType;
};
