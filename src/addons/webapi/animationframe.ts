interface FrameAction {
	id: number;
	callback: (now: number) => void;
}

let actions: FrameAction[] = [];
let global_action_id = 0;

function cancelAnimationFrame(handle: number): void {
	actions = actions.filter(a => a.id !== handle);
}

function requestAnimationFrame(callback: (now: number) => void): number {
	let action = {
		callback,
		id: ++global_action_id,
	};
	actions.push(action);
	return action.id;
}

function tick(now: number) {
	let tasks = actions.slice();
	actions = [];
	for (const task of tasks) {
		task.callback(now);
	}
}

export default {
	tick,
	exports: {
		requestAnimationFrame,
		cancelAnimationFrame
	}
};
