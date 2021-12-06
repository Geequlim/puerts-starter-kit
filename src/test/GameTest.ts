import { testTimer } from './tests/timer';
import { testWebapiMisc } from './tests/misc';
import { testStorage } from './tests/storage';
import { testXHR } from './tests/xhr';
import UnitTest from './UnitTest';

export class GameTest {
	static start() {
		testStorage();
		// testWebapiMisc(),
		testTimer();
		testXHR();
		UnitTest.run();
	}
}
