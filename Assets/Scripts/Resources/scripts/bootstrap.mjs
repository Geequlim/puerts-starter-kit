import "./bundle.mjs";
const entry = globalThis.$entry;
globalThis.$entry = undefined;
export default entry.default;
