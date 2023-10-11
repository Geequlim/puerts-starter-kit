import animationFrame from './animationframe';
import event from './event';
import misc from './misc.unity';
import performance from './performance';
import storage from './storage.unity';
import xhr from './xhr/xhr.unity';

import { initialize } from './index.common';
initialize([
	animationFrame,
	event,
	performance,
	misc,
	storage,
	xhr,
]);

export default window;
