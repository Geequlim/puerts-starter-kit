import UnitTest from './UnitTest';
import { testFileSystem } from './tests/fs';
import { testWebapiMisc } from './tests/misc';
import { testNPM } from './tests/npm-lib';
import { testStorage } from './tests/storage';
import { testTimer } from './tests/timer';
import { testXHR } from './tests/xhr';

export class GameTest {
	static start() {
		testFileSystem();
		testStorage();
		testWebapiMisc();
		testTimer();
		testXHR();
		testNPM();
		UnitTest.run();
	}
}
