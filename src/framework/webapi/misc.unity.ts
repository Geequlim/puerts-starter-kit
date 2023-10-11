function btoa(text: string): string {
	return Buffer.from(text).toString('base64');
}

function atob(base64: string): string {
	return Buffer.from(base64, 'base64').toString();
}

export default {
	exports: {
		atob,
		btoa
	}
};
