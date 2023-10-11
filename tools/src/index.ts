import { createCommand } from 'commander';
import * as path from 'path';
import 'source-map-support/register';
import { injectPuerts2WXMinigame, injectPuerts2WebGL } from './unity/webgl/puerts/injecter';


function main(...argv: string[]) {
	const program = createCommand().version('1.0.0', '-v, --version', '查看版本号');
	program.addHelpText('beforeAll', '轻娱命令行工具集');
	program.helpOption('-h, --help', '查看使用文档');

	const trimArgument = (value: string) => value.trim();

	program.command('unity-webgl')
		.argument('action', `操作名称`, trimArgument)
		.option('-o, --root <channel>', 'WebGL 构建目录', trimArgument)
		.action((name: string, options: { root: string}) => {
			if (name === 'inject-webgl') {
				injectPuerts2WebGL(options.root);
			} else if (name == 'inject-minigame') {
				injectPuerts2WXMinigame(options.root);
			}
		});

	program.parse(argv);
	if (argv.length <= 2) console.log(program.helpInformation());
}
main(...process.argv);
