// import "./bundle.editor.mjs";
// const entry = globalThis.$entry;
// globalThis.$entry = undefined;
// export default entry.default;

export default function(inst) {
	inst.functions.initialize = function() {
		console.log("initialize");
	}
	inst.functions.finalize = function () {
		console.log("finalize");
	}
	console.log("Plugin started with", inst);
}
