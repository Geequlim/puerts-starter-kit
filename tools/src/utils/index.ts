import colors from 'chalk';
import * as cp from 'child_process';
import * as glob from 'fast-glob';
import * as fs from 'fs';
import * as http from 'http';
import * as os from 'os';
import * as path from 'path';
import * as uuid from 'uuid';

export function applyTemplate(flag: string, template: string, content: string) {
	const flagStart = `'$${flag}_START$'`;
	const start = template.indexOf(flagStart);
	const flagEnd = `'$${flag}_END'`;
	const end = template.indexOf(flagEnd);
	if (start == -1) {
		throw new Error(`无法替换文本模板，未找到关键字[${flagStart}]`);
	} else if (end == -1) {
		if (start == -1) {
			throw new Error(`无法替换文本模板，未找到关键字[${flagEnd}]`);
		}
	}
	const front = template.substring(0, start);
	const behand = template.substring(end + flagEnd.length, template.length);
	return `${front}${content}${behand}`;
}

export function join(...pathes: string[]) {
	return pathes.join('/');
}

export function mkdir(path: string) {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path, { recursive: true });
	} else if (!fs.statSync(path).isDirectory()) {
		throw new Error(`无法创建目录${path}, 该路径已存在切不为目录`);
	}
}

export interface ExecuteCommandOptions {
	out?(...message: any[]): void;
	error?(...message: any[]): void;
}

export function runNpmCommand(command: string, stdio = DefaultOutput): Promise<string> {
	return runCommand(`yarn ${command}`, stdio);
}

export const DefaultOutput: ExecuteCommandOptions = {
	out(...message: any[]) {
		console.log(TextStyle.grey('\t', ...message));
	},
	error(...message: any[]) {
		console.log(TextStyle.grey('\t', ...message));
	}
};

export function runCommand(command: string, stdio = DefaultOutput) {
	return new Promise<string>((resolve, reject) => {
		let output = '';
		const child = cp.exec(command);
		child.stdout?.setEncoding('utf8');
		const pipe = (chunk: string, type: 'out' | 'error') => {
			if (stdio && stdio[type]) {
				chunk.split('\n').forEach(line => stdio[type](line));
			}
			output += chunk + '\n';
		};
		child.stdout?.on('data', chunk => pipe(chunk, 'out'));
		child.stderr?.setEncoding('utf-8');
		child.stderr?.on('data', chunk => pipe(chunk, 'error'));
		child.once('error', (error: { message: string; }) => {
			reject(new Error(`执行命令 ${command} 失败:\n${error && error.message ? error.message : error}`));
		});
		child.once('close', (code) => {
			if (!code) {
				resolve(output);
			} else {
				reject(new Error(`执行命令 ${command} 失败, 运行结果为 ${code}`));
			}
		});
	});
}

export const TextStyle = {
	green(...args: any[]) {
		return colors.green(args.join(' '));
	},
	red(...args: any[]) {
		return colors.red(args.join(' '));
	},
	yellow(...args: any[]) {
		return colors.yellow(args.join(' '));
	},
	grey(...args: any[]) {
		return colors.grey(args.join(' '));
	},
	bold(...args: any[]) {
		return colors.bold(args.join(' '));
	},
	default(...args: any[]) {
		return args.join(' ');
	}
};

/**
 * 下载文件
 * @param url 文件URL
 * @param dest 存放路径， 不传的情况下将生成一个临时路径
 */
export function downloadFile(url: string, dest?: string) {
	return new Promise((resolve, reject) => {
		dest = dest || path.join(os.tmpdir(), uuid.v4() + path.extname(url));
		const temp = `${dest}.download`;
		const file = fs.createWriteStream(temp, { flags: 'w' });
		const emptyCallback = () => { };
		const request = http.get(url, response => {
			if (response.statusCode === 200) {
				response.pipe(file);
			} else {
				file.close();
				fs.unlink(temp, emptyCallback);
				reject(new Error(`Server responded with ${response.statusCode}: ${response.statusMessage}`));
			}
		});
		request.on('error', err => {
			file.close();
			fs.unlink(temp, emptyCallback);
			reject(err);
		});
		file.on('finish', () => {
			fs.rename(temp, dest, () => {
				resolve(dest);
			});
		});
		file.on('error', (err: Error & { code: string; }) => {
			file.close();
			fs.unlink(temp, emptyCallback);
			reject(err);
		});
	});
}

export async function isProcessRunning(processName: string): Promise<boolean> {
	const cmd = (() => {
		switch (process.platform) {
			case 'win32': return 'tasklist';
			case 'darwin': return `ps -ax | grep ${processName}`;
			case 'linux': return 'ps -A';
			default: return false;
		}
	})();
	return new Promise((resolve, reject) => {
		require('child_process').exec(cmd, (err: Error, stdout: string, stderr: string) => {
			if (err) reject(err);
			resolve(stdout.toLowerCase().indexOf(processName.toLowerCase()) > -1);
		});
	});
}


//#region path and file
interface NormalizedFileFilter {
	include?: string | string[];
	exclude?: string | string[];
}
export type FileFilter = NormalizedFileFilter | string[] | string;
export type FileFilterOptions = {
	root?: string;
	files?: FileFilter;
	include?: string | string[];
	exclude?: string | string[];
};

export function normalizePattern(pattern: string, root?: string) {
	if (root) pattern = path.join(root, pattern);
	if (fs.existsSync(pattern) && fs.statSync(pattern).isDirectory()) {
		pattern = pattern + '/**/*';
	}
	return normalizePath(pattern).replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

export function normalizePath(path: string) {
	return path.replace(/\\/g, '/').replace(new RegExp('//', 'g'), '/');
}

export function getFiles(rule: FileFilter | FileFilterOptions, root?: string) {
	if (typeof rule === 'object' && rule) {
		root = root || (rule as FileFilterOptions).root;
		if ((rule as FileFilterOptions).files) {
			(rule as FileFilter) = (rule as FileFilterOptions).files;
		}
	}
	const filter = getNormalizedFileFilter(rule as FileFilter, root);
	const exclude = glob.sync(filter.exclude);
	let files = glob.sync(filter.include).filter(f => exclude.indexOf(f) == -1);
	files = files.map(p => normalizePath(p));
	return files;
}

export async function asyncGetFiles(rule: FileFilter | FileFilterOptions, root?: string) {
	if (typeof rule === 'object' && rule) {
		root = root || (rule as FileFilterOptions).root;
		if ((rule as FileFilterOptions).files) {
			(rule as FileFilter) = (rule as FileFilterOptions).files;
		}
	}
	const filter = getNormalizedFileFilter(rule as FileFilter, root);
	const exclude = await glob(filter.exclude);
	let files = (await glob(filter.include)).filter(f => exclude.indexOf(f) == -1);
	files = files.map(p => normalizePath(p));
	return files;
}

export function mergeFileFilters(...filters: FileFilter[]) {
	const ret: { include: string[], exclude: string[]; } = { include: [], exclude: [] };
	for (const f of filters) {
		const ff = getNormalizedFileFilter(f);
		ret.include = ret.include.concat(ff.include);
		ret.exclude = ret.exclude.concat(ff.exclude);
	}
	ret.include = Array.from(new Set<string>(ret.include));
	ret.exclude = Array.from(new Set<string>(ret.exclude));
	return ret;
}

export function getNormalizedFileFilter(pattern: string | string[] | NormalizedFileFilter | { files: string | string[]; }, root?: string) {
	const ret: { include: string[], exclude: string[]; } = { include: [], exclude: [] };
	if (pattern && typeof pattern === 'object' && (pattern as { files: string | string[]; }).files) {
		pattern = (pattern as { files: string | string[]; }).files;
	}

	if (Array.isArray(pattern)) {
		ret.include = pattern.filter(p => !p.startsWith('!')).map(p => normalizePattern(p, root));
		ret.exclude = pattern.filter(p => p.startsWith('!')).map(p => normalizePattern(p.substring(1, p.length), root));
	} else if (typeof pattern === 'string') {
		if (!pattern.startsWith('!')) ret.include = [normalizePattern(pattern, root)];
	} else if (pattern && typeof pattern === 'object') {
		const np = (pattern as NormalizedFileFilter);
		if (np.include) {
			if (typeof np.include === 'string') {
				ret.include = [normalizePattern(np.include, root)];
			} else if (Array.isArray(np.include)) {
				ret.include = np.include.map(p => normalizePattern(p, root));
			}
		}
		if (np.exclude) {
			if (typeof np.exclude === 'string') {
				ret.exclude = [normalizePattern(np.exclude, root)];
			} else if (Array.isArray(np.exclude)) {
				ret.exclude = np.exclude.map(p => normalizePattern(p, root));
			}
		}
	}
	ret.exclude = ret.exclude.concat(ret.include.filter(p => p.startsWith('!')).map(p => p.substring(1, p.length)));
	ret.include = ret.include.filter(p => !p.startsWith('!'));
	return ret;
}
//#endregion

/** 创建软链接 */
export function mklink(target: string, linkTo: string) {
	try {
		if (fs.existsSync(linkTo)) fs.unlinkSync(linkTo);
		if (process.platform === 'win32') {
			cp.execSync(`cmd /c mklink /D /J ${linkTo} ${target}`);
		} else {
			cp.execSync(`ln -s ${path.resolve(target)} ${linkTo}`);
		}
	} catch (error) {
		let message: string = `无法创建目录链接: ${target} => ${linkTo}` + '\n' + (error?.message || error);
		if (process.platform === 'win32') {
			message = `无法创建目录链接: ${target} => ${linkTo}` + '\n' + '请检查: "本地安全策略(secpol.msc)/本地策略/用户权利分配/创建符号链接" 中是否包含当前用户' + '\n' + (error?.message || error);
		}
		throw new Error(message);
	}
}
