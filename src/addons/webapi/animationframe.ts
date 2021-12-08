let global_action_id = 0;
let current = new Map<number, (now: number) => void>();
let next = new Map<number, (now: number) => void>();

function cancelAnimationFrame(handle: number): void {
	next.delete(handle);
}

function requestAnimationFrame(callback: (now: number) => void): number {
	next.set(++global_action_id, callback);
	return global_action_id;
}

function tick(now: number) {
	let temp = current;
	current = next;
	next = temp;
	next.clear();
	for (const [_, action] of current) {
		action(now);
	}
}

export default {
	tick,
	exports: {
		requestAnimationFrame,
		cancelAnimationFrame
	}
};
