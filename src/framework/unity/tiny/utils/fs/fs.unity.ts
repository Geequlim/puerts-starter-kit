import { System, UnityEngine, tiny } from 'csharp';
import { waitUtil } from 'framework/tiny/utils';
import { path } from 'framework/tiny/utils/path';
import { createJSArray } from '../puerts';
const { File, Directory, FileInfo, DirectoryInfo } = System.IO;
const unixEpoch = new System.DateTime(1970, 1, 1, 0, 0, 0, System.DateTimeKind.Utc);

export class UnityFileSystem implements IFilesSystem {

	unlink(filePath: string): Promise<void> {
		try {
			if (File.Exists(filePath)) {
				File.Delete(filePath);
			} else if (Directory.Exists(filePath)) {
				Directory.Delete(filePath, true);
			}
		} catch (err) {
			return Promise.reject(err);
		}
		return Promise.resolve();
	}

	rename(oldPath: string, newPath: string): Promise<void> {
		try {
			if (File.Exists(oldPath)) {
				File.Move(oldPath, newPath);
			} else if (Directory.Exists(oldPath)) {
				Directory.Move(oldPath, newPath);
			}
		} catch (err) {
			return Promise.reject(err);
		}
		return Promise.resolve();
	}

	mkdir(dirPath: string, recursive: boolean): Promise<void> {
		try {
			if (recursive) {
				const dirs = [] as string[];
				let dir = dirPath;
				let exists = this.existsSync(dir);
				while (dir && !exists) {
					dirs.push(dir);
					dir = path.dirname(dir);
					exists = this.existsSync(dir);
				}
				dirs.reverse();
				for (const dir of dirs) {
					Directory.CreateDirectory(dir);
				}
			} else {
				Directory.CreateDirectory(dirPath);
			}
		} catch (err) {
			return Promise.reject(err);
		}
		return Promise.resolve();
	}

	copyFile(src: string, dist: string): Promise<void> {
		try {
			File.Copy(src, dist);
		} catch (error) {
			return Promise.reject(error);
		}
		return Promise.resolve();
	}

	rmdir(dirPath: string, recursive: boolean): Promise<void> {
		if (!Directory.Exists(dirPath) && !recursive) {
			return Promise.reject(new Error(`ENOENT: no such directory, rmdir '${dirPath}'`));
		}
		if (!recursive) {
			if (Directory.GetFileSystemEntries(dirPath).Length > 0) {
				return Promise.reject(new Error(`ENOTEMPTY: directory not empty, rmdir '${dirPath}'`));
			}
			Directory.Delete(dirPath);
		} else {
			Directory.Delete(dirPath, true);
		}
		return Promise.resolve();
	}

	writeFile(filePath: string, data: ArrayBuffer, encoding: 'binary'): Promise<void>;
	writeFile(filePath: string, data: string, encoding: 'utf8' | 'utf-8'): Promise<void>;
	async writeFile(filePath: unknown, data: unknown, encoding: unknown): Promise<void> {
		if (typeof data === 'string') {
			await puer.$promise(File.WriteAllTextAsync(filePath as string, data));
		} else if (data instanceof ArrayBuffer) {
			await puer.$promise(File.WriteAllBytesAsync(filePath as string, tiny.PuertsUtils.Buffer2Bytes(data)));
		}
	}

	exists(filePath: string): Promise<boolean> {
		return Promise.resolve(this.existsSync(filePath));
	}
	existsSync(filePath: string): boolean {
		return File.Exists(filePath) || Directory.Exists(filePath);
	}

	stat(filePath: string): Promise<Stat> {
		try {
			return Promise.resolve(this.statSync(filePath));
		} catch (error) {
			return Promise.reject(error);
		}
	}


	statSync(filePath: string): Stat {
		let info: System.IO.FileSystemInfo = null;
		if (File.Exists(filePath)) info = new FileInfo(filePath);
		else if (Directory.Exists(filePath)) info = new DirectoryInfo(filePath);
		if (!info) throw new Error(`ENOENT: no such file or directory, stat '${filePath}'`);
		const stat = {
			isFile: () => info instanceof FileInfo,
			isDirectory: () => info instanceof DirectoryInfo,
			get size() {
				return info instanceof FileInfo ? Number(info.Length) : 0;
			},
			get lastModifiedTime() {
				const span = System.DateTime.op_Subtraction(info.LastWriteTimeUtc, unixEpoch as any) as unknown as System.TimeSpan;
				return span.TotalMilliseconds;
			}
		} as Stat;
		return stat;
	}


	readdir(dirPath: string): Promise<string[]> {
		try {
			const enties = createJSArray(Directory.GetFileSystemEntries(dirPath));
			return Promise.resolve(enties);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	readFile(filePath: string, encoding: 'binary'): Promise<ArrayBuffer>;
	readFile(filePath: string, encoding: 'utf8' | 'utf-8'): Promise<string>;
	async readFile(filePath: unknown, encoding: unknown): Promise<ArrayBuffer | string> {
		if (encoding === 'binary') {
			const bytes = await puer.$promise(File.ReadAllBytesAsync(filePath as string));
			return tiny.PuertsUtils.Bytes2Buffer(bytes);
		} else {
			const text = await puer.$promise(File.ReadAllTextAsync(filePath as string));
			return text;
		}
	}
}


export class UnityStreamingAssetsFileSystem implements IReadonlyFilesSystem {

	statSync(filePath: string): Stat {
		throw new Error('Method not implemented.');
	}

	readdir(dirPath: string): Promise<string[]> {
		throw new Error('Method not implemented.');
	}

	readFile(filePath: string, encoding: 'binary'): Promise<ArrayBuffer>;
	readFile(filePath: string, encoding: 'utf8' | 'utf-8'): Promise<string>;
	async readFile(filePath: string, encoding: string): Promise<ArrayBuffer | string> {
		let url = path.join(UnityEngine.Application.streamingAssetsPath, filePath);
		if (url.indexOf('://') == -1) {
			url = 'file:///' + url;
		}
		const www = new UnityEngine.WWW(url);
		try {
			await waitUtil(() => www.isDone || www.error, 5000, 50);
		} catch (error) {
			www.Dispose();
			throw error;
		}

		let ret: ArrayBuffer | string;
		if (www.isDone) {
			if (encoding === 'binary') {
				ret = tiny.PuertsUtils.Bytes2Buffer(www.bytes);
			} else {
				ret = www.text;
			}
			www.Dispose();
		} else {
			const err = new Error(www.error);
			www.Dispose();
			throw err;
		}
		return ret;
	}

	exists(filePath: string): Promise<boolean> {
		return Promise.resolve(this.existsSync(filePath));
	}

	existsSync(filePath: string): boolean {
		return true;
	}

	stat(filePath: string): Promise<Stat> {
		try {
			return Promise.resolve(this.statSync(filePath));
		} catch (error) {
			return Promise.reject(error);
		}
	}
}
