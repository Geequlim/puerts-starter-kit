interface StorageItem {
	key: string,
	value: string,
}

export class Storage {

	protected _items: StorageItem[] = [];

	/**
	 * Returns the number of key/value pairs currently present in the list associated with the object.
	 */
	get length(): number { return this._items.length; }

	/**
	 * Empties the list associated with the object of all key/value pairs, if there are any.
	 */
	clear(): void {
		this._items = [];
		this.flush();
	}

	/**
	 * Returns the current value associated with the given key, or null if the given key does not exist in the list associated with the object.
	 */
	getItem(key: string): string | null {
		for (const item of this._items) {
			if (item.key === key)
				return item.value;
		}
		return null;
	}

	/**
	 * Returns the name of the nth key in the list, or null if n is greater than or equal to the number of key/value pairs in the object.
	 */
	key(index: number): string | null {
		for (let i = 0; i < this._items.length; i++) {
			if (i === index)
				return this._items[i].key;
		}
		return null;
	}

	/**
	 * Removes the key/value pair with the given key from the list associated with the object, if a key/value pair with the given key exists.
	 */
	removeItem(key: string): void {
		let idx = -1;
		for (let i = 0; i < this._items.length; i++) {
			if (this._items[i].key === key) {
				idx = i;
				break;
			}
		}
		if (idx != -1) {
			this._items.splice(idx, 1);
			this.flush();
		}
	}

	/**
	 * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
	 *
	 * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
	 */
	setItem(key: string, value: string): void {
		let idx = -1;
		for (let i = 0; i < this._items.length; i++) {
			if (this._items[i].key === key) {
				idx = i;
				break;
			}
		}
		if (idx != -1) {
			if (this._items[idx].value != value) {
				this._items[idx].value = value;
				this.flush();
			}
		} else {
			this._items.push({key, value});
			this.flush();
		}
	}
	protected flush() {}
}

export default {
	exports: {
		Storage,
		sessionStorage: new Storage(),
	}
};
