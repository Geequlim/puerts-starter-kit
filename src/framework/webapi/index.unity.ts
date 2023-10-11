import animation_frame from './animationframe';
import event from './event';
import performance from './performance';
import misc from './misc.unity';
import storage from './storage.unity';
import xhr from './xhr/xhr.unity';

import { initialize } from "./index.common";
initialize([
	animation_frame,
	event,
	performance,
	misc,
	storage,
	xhr,
]);

export default window;
