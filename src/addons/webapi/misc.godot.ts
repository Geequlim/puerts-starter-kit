function atob(data: string): string {
	return godot.Marshalls.base64_to_utf8(data);
}

function btoa(data: string): string {
	return godot.Marshalls.utf8_to_base64(data);
}

export default {
	exports: {
		atob,
		btoa
	}
};
