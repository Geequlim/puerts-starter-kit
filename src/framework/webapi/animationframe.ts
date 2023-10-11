let globalActionID = 0;
let current = new Map<number, (now: number) => void>();
let next = new Map<number, (now: number) => void>();

function cancelAnimationFrame(handle: number): void {
	next.delete(handle);
}

function requestAnimationFrame(callback: (now: number) => void): number {
	next.set(++globalActionID, callback);
	return globalActionID;
}

function tick(now: number) {
	const temp = current;
	current = next;
	next = temp;
	next.clear();
	for (const [, action] of current) {
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
