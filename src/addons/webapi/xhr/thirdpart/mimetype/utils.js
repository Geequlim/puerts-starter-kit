// Copyright © 2017–2018 Domenic Denicola <d@domenic.me>
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

export const removeLeadingAndTrailingHTTPWhitespace = string => {
	return string.replace(/^[ \t\n\r]+/, "").replace(/[ \t\n\r]+$/, "");
};

export const removeTrailingHTTPWhitespace = string => {
	return string.replace(/[ \t\n\r]+$/, "");
};

export const isHTTPWhitespaceChar = char => {
	return char === " " || char === "\t" || char === "\n" || char === "\r";
};

export const solelyContainsHTTPTokenCodePoints = string => {
	return /^[-!#$%&'*+.^_`|~A-Za-z0-9]*$/.test(string);
};

export const soleyContainsHTTPQuotedStringTokenCodePoints = string => {
	return /^[\t\u0020-\u007E\u0080-\u00FF]*$/.test(string);
};

export const asciiLowercase = string => {
	return string.replace(/[A-Z]/g, l => l.toLowerCase());
};

// This variant only implements it with the extract-value flag set.
export const collectAnHTTPQuotedString = (input, position) => {
	let value = "";

	position++;

	while (true) {
		while (position < input.length && input[position] !== "\"" && input[position] !== "\\") {
			value += input[position];
			++position;
		}

		if (position >= input.length) {
			break;
		}

		const quoteOrBackslash = input[position];
		++position;

		if (quoteOrBackslash === "\\") {
			if (position >= input.length) {
				value += "\\";
				break;
			}

			value += input[position];
			++position;
		} else {
			break;
		}
	}

	return [value, position];
};
