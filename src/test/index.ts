import { tiny } from 'csharp';
import { JSEngineBridge, JavaScriptApplication } from 'app';
import { GameTest } from './GameTest';


export class TestApplication extends JavaScriptApplication {

	initialize() {
		GameTest.start();
	}
}

function main(lancher: JSEngineBridge) {
	return new TestApplication(lancher);
}
main(tiny.main.inst);
