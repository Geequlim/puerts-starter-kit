//@ts-ignore
declare module globalThis {
	/**
	 * Creates a base-64 encoded ASCII string from a string of binary data.
	 */
	function btoa(text: string): string;

	/**
	 * Decodes a string of data which has been encoded using base-64 encoding.
	 */
	function atob(base64: string): string;
}
