import { System } from "csharp";

function btoa(text: string): string {
	return System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(text));
}

function atob(base64: string): string {
	let data = System.Convert.FromBase64String(base64);
	let base64Decoded = System.Text.Encoding.ASCII.GetString(data);
	return base64Decoded;
}

export default {
	initialize: function() {
		Object.setPrototypeOf(System.Text.Encoding.ASCII, System.Text.Encoding.prototype);
		Object.setPrototypeOf(System.Text.Encoding.UTF8, System.Text.Encoding.prototype);
	},
	exports: {
		atob,
		btoa
	}
};
