// @ts-nocheck
import { System, UnityEngine } from 'csharp';
import { Storage } from './storage';

class LocalStorage extends Storage {
	protected $file: string;
	protected $directory: string;

	constructor(file: string = `${UnityEngine.Application.persistentDataPath}/webapi/localStorage.json`) {
		super();
		this.$file = file;
		this.$directory = System.IO.Path.GetDirectoryName(this.$file);
		if (System.IO.File.Exists(file)) {
			try {
				const stream = new System.IO.StreamReader(file);
				const text = stream.ReadToEnd();
				stream.Close();
				stream.Dispose();
				this._items = JSON.parse(text);
			} catch (error) {
				throw new Error('Cannot open storage file ' + file);
			}
		}
	}

	protected flush() {
		if (!System.IO.File.Exists(this.$directory)) {
			System.IO.Directory.CreateDirectory(this.$directory);
		}
		const stream = new System.IO.StreamWriter(this.$file);
		if (stream) {
			const text = JSON.stringify(this._items, undefined, '\t');
			stream.Write(text);
			stream.Flush();
			stream.Dispose();
		} else {
			throw new Error('Cannot open storage file ' + this.$file);
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
