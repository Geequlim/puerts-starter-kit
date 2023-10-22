/**
 * 对文件路径的一些操作，针对的是 C:/A/B/C/D/example.ts这种格式
 */
export const path = {

	/**
	 * 格式化文件路径，"C:/A/B//C//D//example.ts"=>"C:/A/B/C/D/example.ts"
	 * @param filename 传入的文件路径
	 */
	normalize: (filename: string): string => {
		const arr = filename.split('/');
		return arr.filter((value, index) => !!value || index == arr.length - 1).join('/');
	},

	/**
	 * 根据文件路径得到文件名字，"C:/A/B/example.ts"=>"example.ts"
	 * @param filename 传入的文件路径
	 * @return 文件的名字
	 */
	basename: (filename: string): string => {
		return filename.substr(filename.lastIndexOf('/') + 1);
	},

	/**
	 * 文件所在文件夹路径，"C:/A/B/example.ts"=>"C:/A/B"
	 * @param path 传入的文件路径
	 * @return 文件所在文件夹的地址
	 */
	dirname: (path: string): string => {
		return path.substr(0, path.lastIndexOf('/'));
	},

	/**
	 * 获得文件拓展名 " text.txt" => "txt"
	 * @param path 传入的文件路径
	 */
	extension: (filename: string): string => {
		const pos = filename.lastIndexOf('.');
		if (pos >= 0 && pos < filename.length - 1) {
			return filename.substring(pos + 1, filename.length);
		}
		return '';
	},

	/**
	 * 获得文件拓展名 " text.yaml.txt" => "yaml.txt"
	 * @param path 传入的文件路径
	 */
	fullExtension: (filename: string): string => {
		filename = path.basename(filename);
		const pos = filename.indexOf('.');
		if (pos >= 0 && pos < filename.length - 1) {
			return filename.substring(pos + 1, filename.length);
		}
		return '';
	},

	join(dir: string, ...pathes: string[]) {
		let ret = dir;
		for (const p of pathes) {
			if (p) {
				ret += '/' + p;
			}
		}
		return ret;
	}
};
