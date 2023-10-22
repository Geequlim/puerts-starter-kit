declare type FileEncoding = 'utf8' | 'binary';
declare type Stat = {
	/** 文件字节大小，未必可靠，实现中如果平台不支持应返回`1` */
	size: number;
	/** 文件最后修改时间，未必可靠，实现中如果平台不支持应返回`0` */
	lastModifiedTime: number;
	/** 是否是文件，未必可靠，实现中如果平台不支持应返回`true` */
	isFile(): boolean;
	/** 是否是目录，未必可靠，实现中如果平台不支持应返回`false` */
	isDirectory(): boolean;
};

/** 只读文件系统 */
declare interface IReadonlyFilesSystem {

	exists(filePath: string): Promise<boolean>;
	existsSync(filePath: string): boolean;

	stat(filePath: string): Promise<Stat>;
	statSync(filePath: string): Stat;

	readdir(dirPath: string): Promise<string[]>;

	readFile(filePath: string, encoding: 'binary'): Promise<ArrayBuffer>;
	readFile(filePath: string, encoding: 'utf8' | 'utf-8'): Promise<string>;
}

/** 文件系统 */
declare interface IFilesSystem extends IReadonlyFilesSystem {

	unlink(filePath: string): Promise<void>;
	rename(oldPath: string, newPath: string): Promise<void>;
	mkdir(dirPath: string, recursive: boolean): Promise<void>;

	copyFile(src: string, dist: string): Promise<void>;

	rmdir(dirPath: string, recursive: boolean): Promise<void>;
	writeFile(filePath: string, data: ArrayBuffer, encoding: 'binary'): Promise<void>;
	writeFile(filePath: string, data: string, encoding: 'utf8' | 'utf-8'): Promise<void>;
}
