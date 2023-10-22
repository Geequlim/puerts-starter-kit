import { System } from 'csharp';
import { $generic, $typeof } from 'puerts';

export type CSharpArray<T> = System.Array$1<T>;
export type CSharpList<T> = System.Collections.Generic.List$1<T>;
export type CSharpDictionary<K, V> = System.Collections.Generic.Dictionary$2<K, V>;

/**
 * 将 C# 的 Array 或 List 转为 JS Array
 * @param source C# 数据源
 */
export function createJSArray<T>(source: System.Array$1<T> | System.Collections.Generic.List$1<T>): T[] {
	if (!source) return undefined;
	let length = 0;
	if (source instanceof System.Array) {
		length = source.Length;
	} else if (source.Count) {
		length = source.Count;
	}
	const array: T[] = [];
	for (let i = 0; i < length; i++) {
		array[i] = source.get_Item(i);
	}
	return array;
}

/**
 * 通过 JavaScript 数组创建 C# 数组
 * @param type C#中的数组元素类型
 * @param source JS源数组
 */
export function createCSharpArray<T>(type: new (...args: any[]) => T, source: readonly T[]) {
	const array = System.Array.CreateInstance($typeof(type), source.length) as System.Array$1<T>;
	for (let i = 0; i < source.length; i++) {
		array.set_Item(i, source[i]);
	}
	return array;
}

/**
 * 通过 JavaScript 数组创建 C# 列表
 * @param type C#中的数组元素类型
 * @param source JS源数组
 */
export function createCSharpList<T, U>(type: new (...args: any[]) => U, source: readonly T[]): CSharpList<T> {
	const List = $generic(System.Collections.Generic.List$1, type);
	const list = new List() as System.Collections.Generic.List$1<T>;
	for (let i = 0; i < source.length; i++) {
		list.Add(source[i]);
	}
	return list;
}

export function createCSharpDictionary<K, V, UK, UV>(keyType: new (...args: any[]) => UK, valueType: new (...args: any[]) => UV, source: Map<K, V>) {
	const Dictionary = $generic(System.Collections.Generic.Dictionary$2, keyType, valueType);
	const dictionary = new Dictionary() as System.Collections.Generic.Dictionary$2<K, V>;
	source.forEach((value, key) => dictionary.Add(key, value));
	return dictionary;
}

/** 解析 UTF8 字符串 */
export function stringFromCSharpBuffer(buffer: System.Array$1<number>): string {
	if (Object.getPrototypeOf(System.Text.Encoding.UTF8) != System.Text.Encoding.prototype) {
		Object.setPrototypeOf(System.Text.Encoding.UTF8, System.Text.Encoding.prototype);
	}
	return System.Text.Encoding.UTF8.GetString(buffer);
}

/** 将 C# 的 Dictionary 转为 Map */
export function dictionaryToMap<K, V>(dictionary: System.Collections.Generic.Dictionary$2<K, V> | System.Collections.Generic.IReadOnlyDictionary$2<K, V>): Map<K, V> {
	if (!dictionary) return undefined;
	const map = new Map<K, V>();
	const enumerator = dictionary.GetEnumerator();
	while (enumerator.MoveNext()) {
		map.set(enumerator.Current.Key, enumerator.Current.Value);
	}
	return map;
}
