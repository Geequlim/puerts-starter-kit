import event from './event';
import timer from './timer';
import performance from './performance';
import xhr from './xhr/xhr.godot';
import misc from './misc.godot';
import storage from './storage.godot';

import { initialize, finalize } from "./index.common";
initialize([
	event,
	timer,
	performance,
	storage,
	misc,
	xhr
]);

//@ts-ignore
export default class GodotWebAPISingleton extends godot.Node {
	_exit_tree() {
		finalize();
	}
}