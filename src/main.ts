import { IScriptLauncher, JavaScriptApplication } from 'app';

export default function main(lancher: IScriptLauncher) {
	return new JavaScriptApplication(lancher);
}
