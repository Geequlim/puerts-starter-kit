import { IScriptLauncher, JavaScriptApplication } from 'app';
import { GameTest } from './GameTest';
import { testNodeJS } from './tests/nodejs';

export class NodeTest extends GameTest {
	static start() {
		testNodeJS();
		return super.start();
	}
}

export class TestApplication extends JavaScriptApplication {
	initialize() {
		NodeTest.start();
	}
}

export default function main(lancher: IScriptLauncher) {
	return new TestApplication(lancher);
}
