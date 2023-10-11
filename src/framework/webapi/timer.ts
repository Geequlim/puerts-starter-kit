// eslint-disable-next-line @typescript-eslint/ban-types
type TimerHandler = Function;

interface Timer {
	handler: TimerHandler;
	timeout: number;
	nextTime?: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	args?: any[];
	oneshot?: boolean;
}
let globalTimerID = 0;

const pendingTimers = new Map<number, Timer>();
const processingTimers = new Map<number, Timer>();
const removingTimers = new Set<number>();

function timerLoop() {
	const now = WebAPI.getHighResTimeStamp();

	for (const [id, timer] of pendingTimers) {
		processingTimers.set(id, timer);
	}
	pendingTimers.clear();

	for (const id of removingTimers) {
		processingTimers.delete(id);
	}
	removingTimers.clear();

	for (const [id, timer] of processingTimers) {
		if (timer.nextTime <= now) {
			try {
				if (timer.handler) timer.handler.apply(null, timer.args);
			} catch (error) {
				console.error(`Error in timer handler: ${error.message}\n${error.stack}`);
			}
			if (timer.oneshot) {
				removingTimers.add(id);
			} else {
				timer.nextTime = now + timer.timeout;
			}
		}
	}
	timerLoopID = requestAnimationFrame(timerLoop);
}

function makeTimer(handler: TimerHandler, timeout?: number, ...args: any[]): Timer {
	return {
		handler,
		timeout,
		nextTime: WebAPI.getHighResTimeStamp() + (timeout || 0),
		args
	};
}

function pendTimer(timer: Timer): number {
	pendingTimers.set(++globalTimerID, timer);
	return globalTimerID;
}

function setTimeout(handler: TimerHandler, timeout?: number, ...args: any[]): number {
	const timer = makeTimer(handler, timeout, ...args);
	timer.oneshot = true;
	return pendTimer(timer);
}

function clearTimeout(handle?: number): void {
	removingTimers.add(handle);
}

function setInterval(handler: TimerHandler, timeout?: number, ...args: any[]): number {
	return pendTimer(makeTimer(handler, timeout, ...args));
}

function clearInterval(handle?: number): void {
	removingTimers.add(handle);
}

let timerLoopID = 0;

export default {
	initialize() {
		timerLoopID = requestAnimationFrame(timerLoop);
	},
	uninitialize() {
		cancelAnimationFrame(timerLoopID);
	},
	exports: {
		setTimeout,
		clearTimeout,
		setInterval,
		clearInterval,
	}
};
