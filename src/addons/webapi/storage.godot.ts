import { Storage } from "./storage";

class LocalStorage extends Storage {
	protected file: string;
	constructor(file: string = "user://localStorage.json") {
		super();
		this.file = file;
		const fs = new godot.File();
		if (fs.file_exists(file)) {
			if (godot.Error.OK == fs.open(file, godot.File.READ)) {
				let text = fs.get_as_text() || "[]";
				fs.close();
				this._items = JSON.parse(text);
			} else {
				throw new Error("Cannot open storage file " + file);
			}
		}
	}

	protected flush() {
		const file = new godot.File();
		if (godot.Error.OK == file.open(this.file, godot.File.WRITE_READ)) {
			let text = JSON.stringify(this._items, undefined, '\t');
			file.store_string(text);
			file.close();
		} else {
			throw new Error("Cannot open storage file " + this.file);
		}
	}
}

export default {
	exports: {
		Storage,
		sessionStorage: new Storage(),
		localStorage: new LocalStorage(),
	}
};