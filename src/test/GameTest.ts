import { testTimer } from './tests/timer';
import { testWebapiMisc } from './tests/misc';
import { testStorage } from './tests/storage';
import { testXHR } from './tests/xhr';
import UnitTest from './UnitTest';
import { testNodeJS } from './tests/nodejs';
import { testNPM } from './tests/npm-lib';

export class GameTest {
	static start() {
		testStorage();
		testWebapiMisc();
		testTimer();
		testXHR();
		testNPM();
		if (process?.release?.name === 'node') testNodeJS();
		UnitTest.run();
	}
}
