import { JSEngineBridge, JavaScriptApplication } from 'app';
import { tiny } from 'csharp';

function main(bridge: JSEngineBridge) {
	return new JavaScriptApplication(bridge);
}
main(tiny.main.inst);
